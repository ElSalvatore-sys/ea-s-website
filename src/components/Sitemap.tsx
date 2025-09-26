import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, Globe, Cpu, ChevronRight, ChevronDown,
  CheckCircle, Users, Euro, Code2, Wrench, Brain,
  Rocket, Home, Sparkles, Award, TrendingUp, 
  Building, Clock, Shield, BarChart3
} from 'lucide-react';
import { useLanguage } from '../providers/LanguageProvider';

interface SitemapNode {
  id: string;
  label: string;
  labelDe: string;
  path?: string;
  icon?: React.ElementType;
  children?: SitemapNode[];
  isComingSoon?: boolean;
  badge?: string;
}

const Sitemap: React.FC = () => {
  const { language } = useLanguage();
  const location = useLocation();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['root']));
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const sitemapData: SitemapNode = {
    id: 'root',
    label: 'EA Solutions',
    labelDe: 'EA Solutions',
    path: '/',
    icon: Home,
    children: [
      {
        id: 'booking',
        label: 'Booking Systems',
        labelDe: 'Buchungssysteme',
        path: '/services/booking-systems',
        icon: Calendar,
        children: [
          {
            id: 'booking-features',
            label: 'Features & Benefits',
            labelDe: 'Funktionen & Vorteile',
            path: '/services/booking-systems#features',
            icon: CheckCircle
          },
          {
            id: 'booking-industries',
            label: 'Industries We Serve',
            labelDe: 'Unsere Branchen',
            path: '/services/booking-systems#industries',
            icon: Building
          },
          {
            id: 'booking-pricing',
            label: 'Pricing Plans',
            labelDe: 'Preispläne',
            path: '/pricing',
            icon: Euro
          }
        ]
      },
      {
        id: 'web',
        label: 'Website Development',
        labelDe: 'Webentwicklung',
        path: '/services/web-development',
        icon: Globe,
        children: [
          {
            id: 'web-portfolio',
            label: 'Portfolio Showcase',
            labelDe: 'Portfolio',
            path: '/portfolio',
            icon: Award
          },
          {
            id: 'web-process',
            label: 'Development Process',
            labelDe: 'Entwicklungsprozess',
            path: '/services/web-development#process',
            icon: TrendingUp
          },
          {
            id: 'web-tech',
            label: 'Technologies Stack',
            labelDe: 'Technologie-Stack',
            path: '/services/web-development#technologies',
            icon: Code2
          }
        ]
      },
      {
        id: 'automation',
        label: 'Business Automation',
        labelDe: 'Geschäftsautomatisierung',
        path: '/services/business-automation',
        icon: Cpu,
        children: [
          {
            id: 'automation-workflows',
            label: 'Workflow Solutions',
            labelDe: 'Workflow-Lösungen',
            path: '/services/business-automation#workflows',
            icon: Wrench
          },
          {
            id: 'automation-ai',
            label: 'AI Integration Tools',
            labelDe: 'KI-Integration',
            path: '/services/business-automation#ai',
            icon: Brain
          },
          {
            id: 'automation-future',
            label: 'Advanced Features',
            labelDe: 'Erweiterte Funktionen',
            icon: Rocket,
            isComingSoon: true,
            badge: 'Coming Soon'
          }
        ]
      }
    ]
  };

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const isActivePath = (path?: string) => {
    if (!path) return false;
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const NodeComponent: React.FC<{ 
    node: SitemapNode; 
    level: number;
    isLast?: boolean;
    parentExpanded?: boolean;
  }> = ({ node, level, isLast = false, parentExpanded = true }) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isActive = isActivePath(node.path);
    const isHovered = hoveredNode === node.id;
    const Icon = node.icon;
    const lang = language === 'de' ? 'de' : 'en';
    const label = lang === 'de' ? node.labelDe : node.label;

    const nodeContent = (
      <div
        className={`relative flex items-center gap-3 ${level > 0 ? 'ml-8' : ''} ${parentExpanded ? '' : 'hidden'}`}
        onMouseEnter={() => setHoveredNode(node.id)}
        onMouseLeave={() => setHoveredNode(null)}
      >
        {/* Connection Line */}
        {level > 0 && (
          <>
            <div className={`absolute -left-8 top-1/2 w-8 h-px bg-white/20 ${isHovered ? 'bg-purple-400/40' : ''}`} />
            {!isLast && (
              <div className={`absolute -left-8 top-1/2 w-px h-full bg-white/20 ${isHovered ? 'bg-purple-400/40' : ''}`} />
            )}
          </>
        )}

        {/* Node */}
        <div
          className={`
            relative flex items-center gap-3 px-4 py-3 rounded-xl
            transition-all duration-300 cursor-pointer
            ${isActive 
              ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/50' 
              : 'bg-white/5 border-white/10 hover:bg-white/10'
            }
            ${node.isComingSoon ? 'opacity-60' : ''}
            backdrop-blur-xl border
          `}
          onClick={() => hasChildren && toggleNode(node.id)}
        >
          {/* Expand/Collapse Icon for parent nodes */}
          {hasChildren && (
            <div
              className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          )}

          {/* Node Icon */}
          {Icon && (
            <div className={`
              p-2 rounded-lg
              ${isActive 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600' 
                : 'bg-white/10'
              }
            `}>
              <Icon className="w-4 h-4 text-white" />
            </div>
          )}

          {/* Node Label */}
          <div className="flex items-center gap-2">
            <span className={`
              font-medium
              ${isActive ? 'text-white' : 'text-gray-300'}
              ${level === 0 ? 'text-lg' : 'text-sm'}
            `}>
              {label}
            </span>
            
            {/* Coming Soon Badge */}
            {node.isComingSoon && (
              <span className="px-2 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                {node.badge}
              </span>
            )}
          </div>

          {/* Hover Glow Effect */}
          {isHovered && !node.isComingSoon && (
            <div
              className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 rounded-xl pointer-events-none transition-opacity duration-200"
            />
          )}
        </div>
      </div>
    );

    return (
      <div className="relative">
        {node.path && !node.isComingSoon ? (
          <Link to={node.path} className="block">
            {nodeContent}
          </Link>
        ) : (
          nodeContent
        )}

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="mt-2 space-y-2">
            {node.children!.map((child, index) => (
              <NodeComponent
                key={child.id}
                node={child}
                level={level + 1}
                isLast={index === node.children!.length - 1}
                parentExpanded={isExpanded}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-12">
      <div
        className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">
              {language === 'de' ? 'Seitennavigation' : 'Site Navigation'}
            </h3>
            <p className="text-gray-400 text-sm">
              {language === 'de' 
                ? 'Entdecken Sie unsere Dienstleistungen und Lösungen' 
                : 'Explore our services and solutions'}
            </p>
          </div>
        </div>

        {/* Sitemap Tree */}
        <div className="space-y-2">
          <NodeComponent node={sitemapData} level={0} />
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="flex flex-wrap gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded"></div>
              <span className="text-gray-400">
                {language === 'de' ? 'Aktuelle Seite' : 'Current Page'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-white/10 rounded"></div>
              <span className="text-gray-400">
                {language === 'de' ? 'Verfügbar' : 'Available'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-purple-400" />
              <span className="text-gray-400">
                {language === 'de' ? 'Demnächst' : 'Coming Soon'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;