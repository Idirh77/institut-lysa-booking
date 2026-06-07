import { useState, useEffect } from 'react'
import { ArrowLeft, Calendar, Lock } from 'lucide-react'

export default function Admin({ setView }) {
  const [rdvs, setRdvs] = useState([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [passwordInput, setPasswordInput] = useState('')
  const [error, setError] = useState('')

  // Le mot de passe secret (Tu pourras le changer ici !)
  const SECRET_PASSWORD = "AdminLysa2026"

  // On charge les rendez-vous seulement si l'admin est connecté
  useEffect(() => {
    if (isAuthenticated) {
      fetch("http://localhost/api-lysa/get_rdv.php")
        .then(res => res.json())
        .then(data => setRdvs(data))
        .catch(err => console.error("Erreur de chargement :", err))
    }
  }, [isAuthenticated])

  const handleLogin = (e) => {
    e.preventDefault()
    if (passwordInput === SECRET_PASSWORD) {
      setIsAuthenticated(true)
      setError('')
    } else {
      setError('Mot de passe incorrect. Réessayez.')
      setPasswordInput('')
    }
  }

  // ÉCRAN 1 : Si l'admin n'est pas encore connecté, on affiche le formulaire de login
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
          <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="text-pink-500" size={28} />
          </div>
          
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Espace Restreint</h2>
          <p className="text-sm text-gray-500 text-center mb-6">Veuillez saisir le mot de passe administrateur.</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                placeholder="Mot de passe" 
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-500 transition-all"
                required
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 font-semibold bg-red-50 p-2.5 rounded-lg border border-red-100 text-center">
                {error}
              </p>
            )}

            <button 
              type="submit"
              className="w-full bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition shadow-md"
            >
              Se connecter
            </button>
          </form>

          <button 
            onClick={() => setView('client')}
            className="w-full text-center text-xs text-gray-400 hover:text-gray-600 mt-6 flex items-center justify-center gap-1 transition-colors"
          >
            <ArrowLeft size={14} /> Retour au site
          </button>
        </div>
      </div>
    )
  }

  // ÉCRAN 2 : Si l'admin est connecté (isAuthenticated === true), on affiche le tableau de bord
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <button 
              onClick={() => setView('client')}
              className="flex items-center gap-2 text-gray-500 hover:text-pink-500 mb-2 text-sm font-medium transition-colors"
            >
              <ArrowLeft size={16} /> Déconnexion
            </button>
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
              <Calendar className="text-pink-500" /> Gestion des Rendez-vous
            </h1>
          </div>
          <div className="bg-green-100 text-green-700 font-bold px-4 py-2 rounded-full text-xs flex items-center gap-2 w-fit">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Mode Admin Activé
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Client</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Prestation</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Horaire</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Contact</th>
                  <th className="px-6 py-4 text-sm font-bold text-gray-600">Date d'enregistrement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rdvs.map((r) => (
                  <tr key={r.id} className="hover:bg-pink-50/20 transition-colors">
                    <td className="px-6 py-4 font-semibold text-gray-800">{r.client_name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-pink-100 text-pink-600 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
                        {r.service_name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-bold">{r.slot_time}</td>
                    <td className="px-6 py-4 text-gray-600 text-sm font-mono">{r.client_phone}</td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {new Date(r.created_at).toLocaleString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rdvs.length === 0 && (
            <div className="text-center py-12 text-gray-400 italic bg-white">Aucun rendez-vous enregistré.</div>
          )}
        </div>
      </div>
    </div>
  )
}