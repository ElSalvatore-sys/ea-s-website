/**
 * Content Validation Utility
 * Scans for translation keys, placeholder text, empty content, and broken assets
 */

interface ValidationIssue {
  type: 'translation_key' | 'placeholder' | 'empty_content' | 'broken_asset';
  severity: 'critical' | 'warning' | 'info';
  location: string;
  message: string;
  details?: any;
}

interface ValidationReport {
  timestamp: string;
  environment: string;
  issues: ValidationIssue[];
  summary: {
    total: number;
    critical: number;
    warnings: number;
    info: number;
  };
}

// Common placeholder patterns to detect
const PLACEHOLDER_PATTERNS = [
  /^(Title|Desc|Description|Text|Content|Placeholder)$/i,
  /Lorem\s+ipsum/i,
  /^Test\s+/i,
  /^Sample\s+/i,
  /^Example\s+/i,
  /^Demo\s+/i,
  /\[PLACEHOLDER\]/i,
  /\[TODO\]/i,
  /^xxx+$/i,
  /^\.{3,}$/,
  /^Coming\s+Soon$/i,
  /^TBD$/i,
  /^TBA$/i,
  /^N\/A$/i
];

// Translation key patterns (e.g., "footer.newsletter.title")
const TRANSLATION_KEY_PATTERNS = [
  /^[a-z]+(\.[a-z]+)+$/i, // Matches patterns like "footer.newsletter.title"
  /^(header|footer|nav|menu|page|section|component|feature|pricing|faq|contact|about|services|solutions)\./i,
  /\.(title|subtitle|description|text|label|button|placeholder|cta|heading)$/i
];

// Known asset paths that should exist
const REQUIRED_ASSETS = [
  '/logo.svg',
  '/favicon.ico',
  '/robots.txt'
];

/**
 * Scan DOM for translation keys appearing as raw text
 */
export function scanForTranslationKeys(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const textNodes = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const text = node.textContent?.trim() || '';
        return text.length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    }
  );

  let node;
  while (node = textNodes.nextNode()) {
    const text = node.textContent?.trim() || '';
    
    // Check if text matches translation key patterns
    if (TRANSLATION_KEY_PATTERNS.some(pattern => pattern.test(text))) {
      const element = (node.parentElement as HTMLElement);
      const location = getElementPath(element);
      
      issues.push({
        type: 'translation_key',
        severity: 'critical',
        location,
        message: `Raw translation key visible: "${text}"`,
        details: { key: text, element: element.tagName }
      });
    }
  }

  return issues;
}

/**
 * Scan DOM for placeholder text
 */
export function scanForPlaceholders(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const textNodes = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const text = node.textContent?.trim() || '';
        return text.length > 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    }
  );

  let node;
  while (node = textNodes.nextNode()) {
    const text = node.textContent?.trim() || '';
    
    // Check if text matches placeholder patterns
    if (PLACEHOLDER_PATTERNS.some(pattern => pattern.test(text))) {
      const element = (node.parentElement as HTMLElement);
      const location = getElementPath(element);
      
      issues.push({
        type: 'placeholder',
        severity: 'warning',
        location,
        message: `Placeholder text detected: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`,
        details: { text, element: element.tagName }
      });
    }
  }

  // Also check for placeholder images
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    const src = img.src;
    if (src.includes('placeholder') || 
        src.includes('placehold.it') || 
        src.includes('via.placeholder') ||
        src.includes('/api/placeholder/')) {
      issues.push({
        type: 'placeholder',
        severity: 'warning',
        location: getElementPath(img),
        message: `Placeholder image detected`,
        details: { src, alt: img.alt }
      });
    }
  });

  return issues;
}

/**
 * Scan for empty or undefined content sections
 */
export function scanForEmptyContent(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  
  // Check for empty sections
  const sections = document.querySelectorAll('section, article, main, [data-content-section]');
  sections.forEach(section => {
    const text = (section as HTMLElement).innerText?.trim();
    const hasOnlyWhitespace = !text || text.length === 0;
    const hasOnlyImages = section.querySelectorAll('*').length === section.querySelectorAll('img').length;
    
    if (hasOnlyWhitespace && !hasOnlyImages) {
      issues.push({
        type: 'empty_content',
        severity: 'warning',
        location: getElementPath(section),
        message: 'Empty content section detected',
        details: { 
          id: (section as HTMLElement).id,
          className: (section as HTMLElement).className
        }
      });
    }
  });

  // Check for elements with "undefined" or "null" text
  const allElements = document.querySelectorAll('*');
  allElements.forEach(element => {
    const text = element.textContent?.trim();
    if (text === 'undefined' || text === 'null' || text === '[object Object]') {
      issues.push({
        type: 'empty_content',
        severity: 'critical',
        location: getElementPath(element),
        message: `Invalid content detected: "${text}"`,
        details: { text }
      });
    }
  });

  return issues;
}

/**
 * Scan for broken images and missing assets
 */
export async function scanForBrokenAssets(): Promise<ValidationIssue[]> {
  const issues: ValidationIssue[] = [];
  
  // Check all images
  const images = document.querySelectorAll('img');
  for (const img of Array.from(images)) {
    if (!img.complete || img.naturalWidth === 0) {
      issues.push({
        type: 'broken_asset',
        severity: 'critical',
        location: getElementPath(img),
        message: `Broken image: ${img.src}`,
        details: { src: img.src, alt: img.alt }
      });
    }
  }

  // Check all stylesheets
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  for (const link of Array.from(stylesheets)) {
    try {
      const response = await fetch((link as HTMLLinkElement).href, { method: 'HEAD' });
      if (!response.ok) {
        issues.push({
          type: 'broken_asset',
          severity: 'critical',
          location: 'document.head',
          message: `Missing stylesheet: ${(link as HTMLLinkElement).href}`,
          details: { href: (link as HTMLLinkElement).href }
        });
      }
    } catch (error) {
      // Ignore CORS errors for external stylesheets
      if (!(link as HTMLLinkElement).href.startsWith(window.location.origin)) {
        continue;
      }
      issues.push({
        type: 'broken_asset',
        severity: 'warning',
        location: 'document.head',
        message: `Cannot verify stylesheet: ${(link as HTMLLinkElement).href}`,
        details: { href: (link as HTMLLinkElement).href, error: error }
      });
    }
  }

  // Check required assets
  for (const assetPath of REQUIRED_ASSETS) {
    try {
      const response = await fetch(assetPath, { method: 'HEAD' });
      if (!response.ok) {
        issues.push({
          type: 'broken_asset',
          severity: 'warning',
          location: 'project root',
          message: `Missing required asset: ${assetPath}`,
          details: { path: assetPath }
        });
      }
    } catch (error) {
      issues.push({
        type: 'broken_asset',
        severity: 'info',
        location: 'project root',
        message: `Cannot verify asset: ${assetPath}`,
        details: { path: assetPath }
      });
    }
  }

  return issues;
}

/**
 * Get a readable path to an element for debugging
 */
function getElementPath(element: Element): string {
  const path: string[] = [];
  let current: Element | null = element;

  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();
    
    if (current.id) {
      selector += `#${current.id}`;
    } else if (current.className) {
      const classes = current.className.split(' ').filter(c => c).slice(0, 2);
      if (classes.length > 0) {
        selector += `.${classes.join('.')}`;
      }
    }
    
    path.unshift(selector);
    current = current.parentElement;
  }

  return path.join(' > ');
}

/**
 * Run all validation checks and generate a comprehensive report
 */
export async function generateValidationReport(): Promise<ValidationReport> {
  console.log('🔍 Starting content validation...');
  
  const translationIssues = scanForTranslationKeys();
  const placeholderIssues = scanForPlaceholders();
  const emptyContentIssues = scanForEmptyContent();
  const brokenAssetIssues = await scanForBrokenAssets();
  
  const allIssues = [
    ...translationIssues,
    ...placeholderIssues,
    ...emptyContentIssues,
    ...brokenAssetIssues
  ];

  const report: ValidationReport = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    issues: allIssues,
    summary: {
      total: allIssues.length,
      critical: allIssues.filter(i => i.severity === 'critical').length,
      warnings: allIssues.filter(i => i.severity === 'warning').length,
      info: allIssues.filter(i => i.severity === 'info').length
    }
  };

  console.log(`✅ Validation complete: ${report.summary.total} issues found`);
  console.log(`   🔴 Critical: ${report.summary.critical}`);
  console.log(`   🟡 Warnings: ${report.summary.warnings}`);
  console.log(`   🔵 Info: ${report.summary.info}`);

  return report;
}

/**
 * Check if content should be shown based on environment
 */
export function shouldShowContent(isReady: boolean = true): boolean {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isStaging = process.env.REACT_APP_ENV === 'staging';
  
  // Always show in development
  if (isDevelopment) {
    return true;
  }
  
  // Show with warning in staging if not ready
  if (isStaging) {
    return true;
  }
  
  // Only show in production if ready
  return isReady;
}

/**
 * Export validation report as JSON
 */
export function exportValidationReport(report: ValidationReport): void {
  const dataStr = JSON.stringify(report, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `content-validation-${Date.now()}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}