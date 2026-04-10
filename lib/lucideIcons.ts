import {
  Globe, Layers, Share2, Cloud, CloudDownload, Server,
  Database, Code, Terminal, Cpu, HardDrive,
  Monitor, Tablet, Smartphone,
  BarChart2, BarChart, PieChart, TrendingUp,
  Mail, MessageSquare, MessageCircle, Send,
  Calendar, Clock, Bell, Star, Bookmark,
  FileText, File, Folder, FolderOpen,
  Settings, Settings2, Wrench,
  Users, User, UserCheck, UserPlus, Lock, Unlock, Key, Shield,
  Home, Building, Building2,
  ShoppingCart, Package, Truck, Tag,
  Search, Zap, Wifi, Link2, ExternalLink,
  Image, Video, Music, Headphones, Camera,
  MapPin,
  CheckSquare, CheckCircle, AlertCircle, Info,
  Download, Upload, ArrowUpRight, RefreshCw,
  Printer, Paperclip, Edit, Edit3, Trash2,
  Plus, Minus, X, Check,
  Play, Pause,
  Sun, Moon, Eye,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const ICON_MAP: Record<string, LucideIcon> = {
  Globe, Layers, Share2, Cloud, CloudDownload, Server,
  Database, Code, Terminal, Cpu, HardDrive,
  Monitor, Tablet, Smartphone,
  BarChart2, BarChart, PieChart, TrendingUp,
  Mail, MessageSquare, MessageCircle, Send,
  Calendar, Clock, Bell, Star, Bookmark,
  FileText, File, Folder, FolderOpen,
  Settings, Settings2, Wrench,
  Users, User, UserCheck, UserPlus, Lock, Unlock, Key, Shield,
  Home, Building, Building2,
  ShoppingCart, Package, Truck, Tag,
  Search, Zap, Wifi, Link2, ExternalLink,
  Image, Video, Music, Headphones, Camera,
  MapPin,
  CheckSquare, CheckCircle, AlertCircle, Info,
  Download, Upload, ArrowUpRight, RefreshCw,
  Printer, Paperclip, Edit, Edit3, Trash2,
  Plus, Minus, X, Check,
  Play, Pause,
  Sun, Moon, Eye,
};

export const ICON_NAMES = Object.keys(ICON_MAP);

export const ICON_COLORS = [
  { label: 'Cyan',   value: '#22d3ee' },
  { label: 'Blue',   value: '#3b82f6' },
  { label: 'Purple', value: '#a855f7' },
  { label: 'Pink',   value: '#ec4899' },
  { label: 'Red',    value: '#ef4444' },
  { label: 'Orange', value: '#f97316' },
  { label: 'Amber',  value: '#f59e0b' },
  { label: 'Green',  value: '#22c55e' },
  { label: 'Teal',   value: '#14b8a6' },
  { label: 'White',  value: '#ffffff' },
  { label: 'Gray',   value: '#94a3b8' },
];

/** Parse "IconName:color" stored in DB */
export function parseIcon(raw: string | null | undefined): { name: string; color: string } {
  if (!raw) return { name: 'Globe', color: '#ffffff' };
  const [name, color] = raw.split(':');
  return { name: name || 'Globe', color: color || '#ffffff' };
}

/** Serialize icon name + color to DB string */
export function serializeIcon(name: string, color: string): string {
  return `${name}:${color}`;
}
