import { useState } from 'react'
import { SERVICES, SLOTS } from './data/services'
import { Calendar, Clock, CheckCircle, Sparkles, User, Phone } from 'lucide-react'
import Admin from './Admin'

function App() {
  const [view, setView] = useState('client') // État pour basculer entre les vues 'client' et 'admin'
  const [selectedService, setSelectedService] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [clientInfo, setClientInfo] = useState({ firstName: '', lastName: '', phone: '' })
  const [isBooked, setIsBooked] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setClientInfo(prev => ({ ...prev, [name]: value }))
  }

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (selectedService && selectedSlot && clientInfo.firstName && clientInfo.lastName && clientInfo.phone) {
      
      const bookingData = {
        service: selectedService.name,
        slot: selectedSlot,
        client: `${clientInfo.firstName} ${clientInfo.lastName}`,
        phone: clientInfo.phone
      };

      try {
        // Envoi des données au Back-end PHP via fetch
        const response = await fetch("http://localhost/api-lysa/save_rdv.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (result.status === "success") {
          setIsBooked(true);
        } else {
          alert("Erreur lors de l'enregistrement : " + result.message);
        }
      } catch (error) {
        console.error("Erreur de connexion à l'API :", error);
        alert("Impossible de joindre le serveur PHP. Vérifie que XAMPP est lancé !");
      }
    }
  }

  // Si l'utilisateur clique sur l'accès admin, on affiche le composant de gestion
  if (view === 'admin') {
    return <Admin setView={setView} />
  }

  if (isBooked) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md border-t-8 border-pink-400">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-green-500 w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Rendez-vous confirmed !</h2>
          <p className="text-gray-600 mb-2">
            Merci <strong>{clientInfo.firstName}</strong>, votre réservation est validée.
          </p>
          <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
            Prestation : <strong>{selectedService.name}</strong> <br />
            Horaire : <strong>{selectedSlot}</strong> <br />
            Contact : <strong>{clientInfo.phone}</strong>
          </p>
          <button onClick={() => window.location.reload()} className="w-full bg-pink-500 text-white font-bold py-3 rounded-xl hover:bg-pink-600 transition shadow-md">
            Prendre un autre rendez-vous
          </button>
        </div>
      </div>
    )
  }

  // Vérification si le formulaire est valide pour activer le bouton
  const isFormValid = clientInfo.firstName.trim() !== '' && clientInfo.lastName.trim() !== '' && clientInfo.phone.trim() !== '';

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <header className="max-w-5xl mx-auto mb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-pink-100 text-pink-600 px-4 py-1 rounded-full text-sm font-bold mb-4">
          <Sparkles size={16} /> INSTITUT LYS'A
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Réservez votre moment</h1>
        <p className="text-gray-500 italic">Choisissez une prestation et l'horaire qui vous convient.</p>
      </header>

      <main className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 1. Services */}
        <section className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
            <span className="bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
            Nos Prestations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SERVICES.map(s => (
              <div 
                key={s.id}
                onClick={() => { setSelectedService(s); setSelectedSlot(null); }} // Reset l'heure si on change de service
                className={`cursor-pointer p-5 rounded-2xl border-2 transition-all shadow-sm bg-white ${
                  selectedService?.id === s.id ? 'border-pink-500 bg-pink-50 ring-4 ring-pink-100' : 'border-transparent hover:border-pink-200'
                }`}
              >
                <h3 className="font-bold text-gray-800">{s.name}</h3>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500 flex items-center gap-1"><Clock size={14}/> {s.duration} min</span>
                  <span className="font-bold text-pink-600 bg-pink-100 px-3 py-1 rounded-lg">{s.price} €</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Horaires & Formulaire */}
        <section className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
            <span className="bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
            Disponibilités
          </h2>
          
          {selectedService ? (
            <form onSubmit={handleBooking} className="space-y-6">
              {/* Grille des horaires */}
              <div className="grid grid-cols-3 gap-2">
                {SLOTS.map(slot => (
                  <button 
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                      selectedSlot === slot 
                      ? 'bg-gray-900 text-white border-transparent' 
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-pink-400'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              {/* Formulaire de coordonnées (Apparaît si l'heure est choisie) */}
              {selectedSlot && (
                <div className="space-y-3 pt-4 border-t border-gray-100 animation-fade-in">
                  <h3 className="font-bold text-gray-700 text-sm mb-2 uppercase tracking-wide">Vos Informations</h3>
                  
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      name="lastName"
                      placeholder="Nom"
                      value={clientInfo.lastName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-400 focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div className="relative">
                    <User className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      name="firstName"
                      placeholder="Prénom"
                      value={clientInfo.firstName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-400 focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input 
                      type="tel" 
                      name="phone"
                      placeholder="Numéro de téléphone"
                      value={clientInfo.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-pink-400 focus:bg-white transition-all"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={!isFormValid}
                    className={`w-full mt-4 py-3.5 rounded-xl font-bold text-base shadow-md transition-all ${
                      isFormValid 
                      ? 'bg-pink-500 text-white hover:bg-pink-600 shadow-pink-100 hover:-translate-y-0.5' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                    }`}
                  >
                    Confirmer le RDV
                  </button>
                </div>
              )}
            </form>
          ) : (
            <div className="text-center py-12">
              <Calendar className="mx-auto text-gray-300 mb-4" size={48} />
              <p className="text-gray-400 text-sm">Sélectionnez un soin pour voir les disponibilités.</p>
            </div>
          )}
        </section>
      </main>

      {/* Pied de page avec le bouton secret d'accès au tableau de bord */}
      <footer className="max-w-5xl mx-auto mt-12 pb-8 text-center">
        <button 
          onClick={() => setView('admin')}
          className="text-gray-400 hover:text-pink-500 text-xs font-medium transition-colors border-b border-dashed border-gray-300"
        >
          Accès Dashboard Institut
        </button>
      </footer>
    </div>
  )
}

export default App