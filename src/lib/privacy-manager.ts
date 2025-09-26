/**
 * GDPR Privacy Manager
 * Handles user data rights, consent management, and privacy compliance
 */

export interface UserDataRequest {
  type: 'access' | 'delete' | 'portability' | 'rectification';
  email: string;
  requestId: string;
  timestamp: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  reason?: string;
}

export interface ConsentRecord {
  userId?: string;
  sessionId: string;
  timestamp: string;
  consentVersion: string;
  settings: {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    preferences: boolean;
  };
  ipHash: string;
  userAgent: string;
  legal_basis: 'consent' | 'legitimate_interest' | 'contract' | 'legal_obligation';
}

export interface DataRetentionPolicy {
  dataType: string;
  retentionPeriod: number; // days
  deletionDate: Date;
  status: 'active' | 'scheduled_deletion' | 'deleted';
}

export class PrivacyManager {
  private static instance: PrivacyManager;
  private apiBase = '/api/gdpr';

  static getInstance(): PrivacyManager {
    if (!PrivacyManager.instance) {
      PrivacyManager.instance = new PrivacyManager();
    }
    return PrivacyManager.instance;
  }

  /**
   * Submit a GDPR data request (Art. 15, 17, 20, 16)
   */
  async submitDataRequest(type: UserDataRequest['type'], email: string, additionalData?: any): Promise<string> {
    const requestId = this.generateRequestId();
    
    const request: UserDataRequest = {
      type,
      email,
      requestId,
      timestamp: new Date().toISOString(),
      status: 'pending',
      ...additionalData,
    };

    try {
      const response = await fetch(`${this.apiBase}/data-request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.statusText}`);
      }

      // Send confirmation email
      await this.sendConfirmationEmail(email, type, requestId);
      
      return requestId;
    } catch (error) {
      console.error('Failed to submit data request:', error);
      throw error;
    }
  }

  /**
   * Get user's data for GDPR Article 15 (Right of Access)
   */
  async getUserData(email: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiBase}/user-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve user data');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get user data:', error);
      throw error;
    }
  }

  /**
   * Delete user data for GDPR Article 17 (Right to be Forgotten)
   */
  async deleteUserData(email: string, requestId: string): Promise<void> {
    try {
      const response = await fetch(`${this.apiBase}/delete-data`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, requestId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete user data');
      }

      // Clear local storage for this user
      this.clearLocalUserData(email);
    } catch (error) {
      console.error('Failed to delete user data:', error);
      throw error;
    }
  }

  /**
   * Export user data for GDPR Article 20 (Data Portability)
   */
  async exportUserData(email: string, format: 'json' | 'csv' = 'json'): Promise<Blob> {
    try {
      const response = await fetch(`${this.apiBase}/export-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, format }),
      });

      if (!response.ok) {
        throw new Error('Failed to export user data');
      }

      return await response.blob();
    } catch (error) {
      console.error('Failed to export user data:', error);
      throw error;
    }
  }

  /**
   * Record consent for audit trail
   */
  async recordConsent(consentData: Omit<ConsentRecord, 'timestamp'>): Promise<void> {
    const record: ConsentRecord = {
      ...consentData,
      timestamp: new Date().toISOString(),
    };

    try {
      await fetch(`${this.apiBase}/consent-log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(record),
      });
    } catch (error) {
      console.error('Failed to record consent:', error);
      // Store locally as fallback
      this.storeConsentLocally(record);
    }
  }

  /**
   * Get consent history for a user
   */
  async getConsentHistory(email: string): Promise<ConsentRecord[]> {
    try {
      const response = await fetch(`${this.apiBase}/consent-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to get consent history');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to get consent history:', error);
      return [];
    }
  }

  /**
   * Check if user has valid consent for specific processing
   */
  hasValidConsent(consentType: keyof ConsentRecord['settings']): boolean {
    try {
      const savedConsent = localStorage.getItem('ea-s-cookie-consent');
      if (!savedConsent) return false;

      const consent = JSON.parse(savedConsent);
      return consent.settings?.[consentType] === true;
    } catch {
      return false;
    }
  }

  /**
   * Withdraw consent for specific processing
   */
  async withdrawConsent(email: string, consentTypes: string[]): Promise<void> {
    try {
      await fetch(`${this.apiBase}/withdraw-consent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, consentTypes }),
      });

      // Update local consent
      const savedConsent = localStorage.getItem('ea-s-cookie-consent');
      if (savedConsent) {
        const consent = JSON.parse(savedConsent);
        consentTypes.forEach(type => {
          if (consent.settings[type] !== undefined) {
            consent.settings[type] = false;
          }
        });
        localStorage.setItem('ea-s-cookie-consent', JSON.stringify(consent));
      }
    } catch (error) {
      console.error('Failed to withdraw consent:', error);
      throw error;
    }
  }

  /**
   * Schedule data deletion based on retention policy
   */
  async scheduleDataDeletion(dataType: string, retentionDays: number): Promise<void> {
    const deletionDate = new Date();
    deletionDate.setDate(deletionDate.getDate() + retentionDays);

    const policy: DataRetentionPolicy = {
      dataType,
      retentionPeriod: retentionDays,
      deletionDate,
      status: 'scheduled_deletion',
    };

    try {
      await fetch(`${this.apiBase}/schedule-deletion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(policy),
      });
    } catch (error) {
      console.error('Failed to schedule data deletion:', error);
      throw error;
    }
  }

  /**
   * Anonymize data instead of deletion (for analytics)
   */
  async anonymizeData(email: string, dataTypes: string[]): Promise<void> {
    try {
      await fetch(`${this.apiBase}/anonymize-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, dataTypes }),
      });
    } catch (error) {
      console.error('Failed to anonymize data:', error);
      throw error;
    }
  }

  /**
   * Generate privacy impact assessment report
   */
  async generatePIAReport(): Promise<any> {
    try {
      const response = await fetch(`${this.apiBase}/pia-report`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Failed to generate PIA report');
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to generate PIA report:', error);
      throw error;
    }
  }

  /**
   * Validate email for data requests
   */
  private async sendConfirmationEmail(email: string, requestType: string, requestId: string): Promise<void> {
    try {
      await fetch(`${this.apiBase}/send-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, requestType, requestId }),
      });
    } catch (error) {
      console.warn('Failed to send confirmation email:', error);
    }
  }

  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  private clearLocalUserData(email: string): void {
    // Clear user-specific data from localStorage
    const keysToCheck = [
      'ea-s-user-preferences',
      'ea-s-analytics-data',
      'ea-s-session-data',
    ];

    keysToCheck.forEach(key => {
      try {
        const data = localStorage.getItem(key);
        if (data) {
          const parsed = JSON.parse(data);
          if (parsed.email === email) {
            localStorage.removeItem(key);
          }
        }
      } catch {
        // Ignore parsing errors
      }
    });
  }

  private storeConsentLocally(record: ConsentRecord): void {
    try {
      const existingConsent = localStorage.getItem('ea-s-consent-backup') || '[]';
      const consentBackup = JSON.parse(existingConsent);
      consentBackup.push(record);
      
      // Keep only last 10 records locally
      if (consentBackup.length > 10) {
        consentBackup.splice(0, consentBackup.length - 10);
      }
      
      localStorage.setItem('ea-s-consent-backup', JSON.stringify(consentBackup));
    } catch (error) {
      console.warn('Failed to store consent locally:', error);
    }
  }

  /**
   * Check if we need to show data retention notice
   */
  shouldShowRetentionNotice(): boolean {
    const lastShown = localStorage.getItem('ea-s-retention-notice');
    if (!lastShown) return true;

    const lastShownDate = new Date(lastShown);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    return lastShownDate < oneYearAgo;
  }

  /**
   * Mark retention notice as shown
   */
  markRetentionNoticeShown(): void {
    localStorage.setItem('ea-s-retention-notice', new Date().toISOString());
  }
}

// Export singleton instance
export const privacyManager = PrivacyManager.getInstance();

// Utility functions for common privacy checks
export const privacyUtils = {
  /**
   * Check if we can use analytics
   */
  canUseAnalytics: (): boolean => {
    return privacyManager.hasValidConsent('analytics');
  },

  /**
   * Check if we can use marketing cookies
   */
  canUseMarketing: (): boolean => {
    return privacyManager.hasValidConsent('marketing');
  },

  /**
   * Check if we can store preferences
   */
  canStorePreferences: (): boolean => {
    return privacyManager.hasValidConsent('preferences');
  },

  /**
   * Get current consent status
   */
  getConsentStatus: () => {
    try {
      const savedConsent = localStorage.getItem('ea-s-cookie-consent');
      if (!savedConsent) return null;
      return JSON.parse(savedConsent);
    } catch {
      return null;
    }
  },

  /**
   * Initialize Google Analytics with consent
   */
  initializeAnalytics: () => {
    if (privacyUtils.canUseAnalytics()) {
      // Initialize GA4 with consent
      (window as any).gtag?.('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  },

  /**
   * Track event with consent check
   */
  trackEvent: (eventName: string, parameters?: any) => {
    if (privacyUtils.canUseAnalytics() && (window as any).gtag) {
      (window as any).gtag('event', eventName, parameters);
    }
  }
};