import { useEffect, useState } from 'react';
import { Apple, Monitor, FileText, Check, ArrowDownToLine, Loader2 } from 'lucide-react';

interface ReleaseAsset {
  id: number;
  name: string;
  size: number;
  browser_download_url: string;
}

interface ReleaseData {
  tag_name: string;
  published_at: string;
  body: string;
  assets: ReleaseAsset[];
}

export default function App() {
  const [release, setRelease] = useState<ReleaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const repoOwner = "geeksmanin";
  const repoName = "erp-release";

  useEffect(() => {
    async function fetchRelease() {
      try {
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/releases/latest`);
        if (!response.ok) {
          throw new Error('Failed to fetch release information');
        }
        const data = await response.json();
        setRelease(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Unable to retrieve latest version');
      } finally {
        setLoading(false);
      }
    }
    fetchRelease();
  }, []);

  // Format file sizes
  const formatBytes = (bytes: number, decimals = 1) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  // Simplistic markdown-to-html formatter for release notes
  const renderMarkdown = (markdown: string) => {
    const formatted = markdown
      .replace(/### (.*)/g, '<h4 style="color:white;margin-top:1rem;margin-bottom:0.5rem;font-weight:600;">$1</h4>')
      .replace(/## (.*)/g, '<h3 style="color:white;margin-top:1.5rem;margin-bottom:0.75rem;font-weight:700;">$1</h3>')
      .replace(/# (.*)/g, '<h2 style="color:white;margin-top:2rem;margin-bottom:1rem;font-weight:800;">$1</h2>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/- (.*)/g, '<li>$1</li>')
      .replace(/`([^`]+)`/g, '<code style="background-color:rgba(255,255,255,0.06);padding:0.2rem 0.4rem;border-radius:4px;font-size:0.9em;color:#f43f5e;">$1</code>')
      .replace(/\n\n/g, '<br/><br/>')
      .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
      .replace(/<\/ul>\s*<ul>/g, '');
    return <div dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  // Resolve platform assets
  let macAsset: any = null;
  let winAsset: any = null;

  if (release?.assets) {
    release.assets.forEach(asset => {
      const name = asset.name.toLowerCase();
      if (name.includes('darwin') || name.includes('mac') || name.includes('universal')) {
        macAsset = asset;
      }
      if (name.includes('win') || name.includes('windows')) {
        winAsset = asset;
      }
    });
  }

  const fallbackLink = `https://github.com/${repoOwner}/${repoName}/releases/latest`;
  const macDownloadUrl = macAsset ? macAsset.browser_download_url : fallbackLink;
  const winDownloadUrl = winAsset ? winAsset.browser_download_url : fallbackLink;

  return (
    <>
      <div className="glow-blob blob-1"></div>
      <div className="glow-blob blob-2"></div>

      <div className="container">
        <header>
          <div className="logo-container">
            <svg className="logo-icon" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9s2.015-9 4.5-9m0 0a9.015 9.015 0 010 18M12 3a9.004 9.004 0 00-8.716 6.747M12 3a9.004 9.004 0 018.716 6.747M3.284 9.753a9.002 9.002 0 0117.432 0M3.284 9.753L21 9.753M3.284 14.247a9.003 9.003 0 0117.432 0M3.284 14.247L21 14.247" />
            </svg>
          </div>
          <h1>Geeksman OS ERP</h1>
          <p className="subtitle">Experience a new era of enterprise resource planning. Clean, blazingly fast, and fully integrated desktop application for your organization.</p>
          
          <div className="version-tag">
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <div className="pulse-dot"></div>
            )}
            <span>
              {loading && "Loading latest version..."}
              {!loading && error && "Unable to check version"}
              {!loading && !error && release && `Latest: ${release.tag_name} (${new Date(release.published_at).toLocaleDateString()})`}
            </span>
          </div>
        </header>

        <div className="download-grid">
          {/* macOS Card */}
          <div className="download-card mac">
            <div className="card-header">
              <div className="os-icon">
                <Apple size={24} />
              </div>
              <div className="os-info">
                <h3>macOS</h3>
                <p>Intel & Apple Silicon (M1/M2/M3)</p>
              </div>
            </div>
            <ul className="features-list">
              <li>
                <Check size={18} />
                Universal Binary support
              </li>
              <li>
                <Check size={18} />
                Native dark mode integration
              </li>
              <li>
                <Check size={18} />
                Automatic OTA updates
              </li>
            </ul>
            <a href={macDownloadUrl} className="btn-download btn-mac">
              <ArrowDownToLine size={20} />
              {macAsset ? `Download for Mac (${formatBytes(macAsset.size)})` : 'Download from GitHub'}
            </a>
          </div>

          {/* Windows Card */}
          <div className="download-card windows">
            <div className="card-header">
              <div className="os-icon">
                <Monitor size={24} />
              </div>
              <div className="os-info">
                <h3>Windows</h3>
                <p>Windows 10 / 11 (64-bit)</p>
              </div>
            </div>
            <ul className="features-list">
              <li>
                <Check size={18} />
                Optimized for x64 architecture
              </li>
              <li>
                <Check size={18} />
                Single-file portable deployment
              </li>
              <li>
                <Check size={18} />
                Direct background patching
              </li>
            </ul>
            <a href={winDownloadUrl} className="btn-download btn-win">
              <ArrowDownToLine size={20} />
              {winAsset ? `Download for Windows (${formatBytes(winAsset.size)})` : 'Download from GitHub'}
            </a>
          </div>
        </div>

        {/* Release Notes */}
        <div className="release-section">
          <div className="section-title">
            <FileText size={24} />
            Release Notes
          </div>
          <div className="release-content">
            {loading && "Fetching release notes from GitHub..."}
            {!loading && error && <p style={{ color: '#ef4444' }}>Failed to retrieve release notes. Please visit the GitHub releases page directly.</p>}
            {!loading && !error && release && renderMarkdown(release.body)}
          </div>
        </div>

        {/* Installation Guides */}
        <div className="guide-section">
          <div className="guide-card">
            <h4>🍏 macOS Installation</h4>
            <ol>
              <li>Download the `Geeksman_OS_darwin_universal.zip` archive.</li>
              <li>Extract the downloaded archive to get **Geeksman OS.app**.</li>
              <li>Drag the application to your **Applications** folder.</li>
              <li>If you see a security warning on startup: Go to **System Settings &gt; Privacy & Security** and click **"Open Anyway"**.</li>
            </ol>
          </div>

          <div className="guide-card">
            <h4>🏁 Windows Installation</h4>
            <ol>
              <li>Download the `Geeksman_OS_windows_amd64.zip` archive.</li>
              <li>Extract the ZIP package to a folder of your choice.</li>
              <li>Double-click **GeeksmanOS.exe** to start the ERP interface.</li>
              <li>If Windows SmartScreen prompts a warning, click **"More Info"** and then select **"Run Anyway"**.</li>
            </ol>
          </div>
        </div>

        <footer>
          <p>&copy; 2026 Geeksman Inc. | Releases distributed via <a href={`https://github.com/${repoOwner}/${repoName}`} target="_blank" rel="noreferrer">GitHub</a></p>
        </footer>
      </div>
    </>
  );
}
