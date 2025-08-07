import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Alert, AlertDescription } from '@/components/ui/alert.jsx'
import { Copy, Download, Upload, Code, Shield, Zap, Menu, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import Editor from '@monaco-editor/react'
import axios from 'axios'
import './App.css'

const API_BASE_URL = '/api'

function App() {
  const [activeTab, setActiveTab] = useState('javascript')
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [codes, setCodes] = useState({
    javascript: '// Votre code JavaScript ici\nfunction hello() {\n  console.log("Hello World!");\n}',
    css: '/* Votre code CSS ici */\n.header {\n  color: red;\n  font-size: 16px;\n}\n\n#main {\n  background: blue;\n}',
    html: '<!-- Votre code HTML ici -->\n<!DOCTYPE html>\n<html>\n<head>\n  <title>Test</title>\n</head>\n<body>\n  <h1>Hello World</h1>\n</body>\n</html>'
  })
  
  const [obfuscatedCodes, setObfuscatedCodes] = useState({
    javascript: '',
    css: '',
    html: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  // Détection de la taille d'écran
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  const handleCodeChange = (value, language) => {
    setCodes(prev => ({
      ...prev,
      [language]: value || ''
    }))
    setError(null)
    setSuccess(false)
  }

  const obfuscateCode = async (type) => {
    setLoading(true)
    setError(null)
    setSuccess(false)
    
    try {
      // Simulation d'obfuscation locale pour le développement
      const code = codes[type]
      if (!code.trim()) {
        throw new Error('Veuillez entrer du code à obfusquer')
      }

      // Simulation d'un délai de traitement
      await new Promise(resolve => setTimeout(resolve, 1000))

      let obfuscatedCode = ''
      let originalSize = code.length
      let obfuscatedSize = 0

      switch (type) {
        case 'javascript':
          // Simulation d'obfuscation JavaScript
          obfuscatedCode = `// NICE-OBF - Code obfusqué\nvar _0x${Math.random().toString(36).substr(2, 9)}=['${code.replace(/['"]/g, '').split(' ').join("','")}']; function _0x${Math.random().toString(36).substr(2, 6)}(){console.log(_0x${Math.random().toString(36).substr(2, 9)}[0]);}`
          break
        case 'css':
          // Simulation d'obfuscation CSS
          obfuscatedCode = `/* NICE-OBF - CSS obfusqué */ ${code.replace(/\s+/g, ' ').replace(/;\s*/g, ';').replace(/{\s*/g, '{').replace(/}\s*/g, '}')}`
          break
        case 'html':
          // Simulation d'obfuscation HTML
          obfuscatedCode = `<!-- NICE-OBF - HTML obfusqué -->${code.replace(/>\s+</g, '><').replace(/\s+/g, ' ')}`
          break
      }

      obfuscatedSize = obfuscatedCode.length

      setObfuscatedCodes(prev => ({
        ...prev,
        [type]: obfuscatedCode
      }))
      
      setStats({
        originalSize,
        obfuscatedSize,
        compressionRatio: (originalSize / obfuscatedSize).toFixed(2),
        processingTime: Math.floor(Math.random() * 500) + 200
      })

      setSuccess(true)
      
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'obfuscation')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text)
      // Feedback visuel temporaire
      setSuccess(true)
      setTimeout(() => setSuccess(false), 2000)
    } catch (err) {
      setError('Impossible de copier dans le presse-papiers')
    }
  }

  const downloadFile = (content, filename) => {
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getLanguageConfig = (language) => {
    const configs = {
      javascript: {
        title: 'JavaScript',
        shortTitle: 'JS',
        icon: <Code className="w-4 h-4" />,
        extension: '.js',
        monacoLanguage: 'javascript',
        color: 'from-yellow-400 to-orange-500'
      },
      css: {
        title: 'CSS',
        shortTitle: 'CSS',
        icon: <Zap className="w-4 h-4" />,
        extension: '.css',
        monacoLanguage: 'css',
        color: 'from-blue-400 to-cyan-500'
      },
      html: {
        title: 'HTML',
        shortTitle: 'HTML',
        icon: <Shield className="w-4 h-4" />,
        extension: '.html',
        monacoLanguage: 'html',
        color: 'from-red-400 to-pink-500'
      }
    }
    return configs[language]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header amélioré */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-2xl">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              NICE-OBF
            </span>
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl lg:text-2xl mb-6 max-w-3xl mx-auto">
            Obfuscateur de code professionnel pour JavaScript, CSS et HTML
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4">
            <Badge variant="secondary" className="text-sm px-4 py-2 bg-purple-600/20 text-purple-300 border-purple-500/30">
              <Code className="w-4 h-4 mr-2" />
              Développé par NICE-DEV
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-2 border-pink-500/30 text-pink-300">
              📞 +22603582906
            </Badge>
          </div>
        </div>

        {/* Main Content avec design amélioré */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm shadow-2xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-white flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Code className="w-5 h-5 text-white" />
                </div>
                Code Source
              </CardTitle>
              <CardDescription className="text-slate-400">
                Collez votre code ou importez un fichier
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3 bg-slate-700/50 h-12 p-1">
                  {['javascript', 'css', 'html'].map((lang) => {
                    const config = getLanguageConfig(lang)
                    return (
                      <TabsTrigger 
                        key={lang}
                        value={lang} 
                        className={`data-[state=active]:bg-gradient-to-r data-[state=active]:${config.color} data-[state=active]:text-white text-sm py-2 px-4 rounded-md transition-all duration-200`}
                      >
                        <span className="flex items-center gap-2">
                          {config.icon}
                          <span className="hidden sm:inline">{config.title}</span>
                          <span className="sm:hidden">{config.shortTitle}</span>
                        </span>
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
                
                {['javascript', 'css', 'html'].map((language) => (
                  <TabsContent key={language} value={language} className="mt-6 space-y-4">
                    <div className="border border-slate-600/50 rounded-xl overflow-hidden shadow-lg">
                      <Editor
                        height={isMobile ? "300px" : "400px"}
                        language={getLanguageConfig(language).monacoLanguage}
                        value={codes[language]}
                        onChange={(value) => handleCodeChange(value, language)}
                        theme="vs-dark"
                        options={{
                          minimap: { enabled: !isMobile },
                          fontSize: isMobile ? 14 : 16,
                          lineNumbers: 'on',
                          roundedSelection: false,
                          scrollBeyondLastLine: false,
                          automaticLayout: true,
                          wordWrap: isMobile ? 'on' : 'off',
                          padding: { top: 16, bottom: 16 },
                          scrollbar: {
                            vertical: 'auto',
                            horizontal: 'auto'
                          }
                        }}
                      />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        onClick={() => obfuscateCode(language)}
                        disabled={loading || !codes[language].trim()}
                        className={`bg-gradient-to-r ${getLanguageConfig(language).color} hover:opacity-90 text-white font-medium px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex-1`}
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Obfuscation...
                          </>
                        ) : (
                          <>
                            <Shield className="w-4 h-4 mr-2" />
                            Obfusquer {getLanguageConfig(language).title}
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="border-slate-600 text-slate-300 hover:bg-slate-700 px-6 py-3 rounded-lg transition-all duration-200"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Importer
                      </Button>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm shadow-2xl">
            <CardHeader className="pb-6">
              <CardTitle className="text-white flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                Code Obfusqué
              </CardTitle>
              <CardDescription className="text-slate-400">
                Résultat de l'obfuscation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert className="border-red-500/50 bg-red-500/10 backdrop-blur-sm">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && !error && (
                <Alert className="border-green-500/50 bg-green-500/10 backdrop-blur-sm">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <AlertDescription className="text-green-400">
                    Code obfusqué avec succès !
                  </AlertDescription>
                </Alert>
              )}
              
              {stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-xl backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {stats.originalSize}
                    </div>
                    <div className="text-xs text-slate-400">Octets originaux</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {stats.obfuscatedSize}
                    </div>
                    <div className="text-xs text-slate-400">Octets obfusqués</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400 mb-1">
                      {stats.compressionRatio}x
                    </div>
                    <div className="text-xs text-slate-400">Ratio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400 mb-1">
                      {stats.processingTime}ms
                    </div>
                    <div className="text-xs text-slate-400">Temps</div>
                  </div>
                </div>
              )}
              
              <div className="border border-slate-600/50 rounded-xl overflow-hidden shadow-lg">
                <Editor
                  height={isMobile ? "300px" : "400px"}
                  language={getLanguageConfig(activeTab).monacoLanguage}
                  value={obfuscatedCodes[activeTab]}
                  theme="vs-dark"
                  options={{
                    readOnly: true,
                    minimap: { enabled: !isMobile },
                    fontSize: isMobile ? 14 : 16,
                    lineNumbers: 'on',
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    wordWrap: isMobile ? 'on' : 'off',
                    padding: { top: 16, bottom: 16 },
                    scrollbar: {
                      vertical: 'auto',
                      horizontal: 'auto'
                    }
                  }}
                />
              </div>
              
              {obfuscatedCodes[activeTab] && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => copyToClipboard(obfuscatedCodes[activeTab])}
                    className="border-green-500/50 text-green-400 hover:bg-green-500/10 px-6 py-3 rounded-lg transition-all duration-200 flex-1"
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copier
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => downloadFile(
                      obfuscatedCodes[activeTab], 
                      `nice-obf${getLanguageConfig(activeTab).extension}`
                    )}
                    className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 px-6 py-3 rounded-lg transition-all duration-200 flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Télécharger
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Footer amélioré */}
        <div className="text-center mt-16 pt-8 border-t border-slate-700/50">
          <p className="text-slate-400 text-lg mb-4">
            Développé avec ❤️ par{' '}
            <a 
              href="https://nice-dev226.netlify.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              NICE-DEV
            </a>
          </p>
          <div className="flex justify-center items-center gap-6 text-sm text-slate-500">
            <span>© 2025 NICE-OBF</span>
            <span>•</span>
            <span>Tous droits réservés</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

