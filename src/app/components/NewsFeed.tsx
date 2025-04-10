'use client'

export default function NewsFeed() {
  const news = [
    { title: '🚀 Version 1.0 ist da!', text: 'Multiplayer + Elo-System aktiv.' },
    { title: '⚔️ Neue Arena: "Rival Rush"', text: 'Kämpfe live gegen andere Spieler.' },
    { title: '📚 Erste FH-Woche überlebt!', text: 'Nur 3 Nervenzusammenbrüche und 1 Kaffeevergiftung. Läuft.' },
    { title: '🥐 Mensa-Update:', text: 'Der mysteriöse "Veggie Wrap Deluxe" bleibt unidentifiziert.' },
    { title: '📣 Typing-Turnier nächste Woche!', text: 'Mit Preisen wie Ruhm, Ehre und einem halben Müsliriegel.' },
    { title: '🐛 Bugfixes & Features', text: 'Der Logout-Button funktioniert jetzt wirklich. Versprochen.' },
    { title: '💡 FH Salzburg Pro-Tipp:', text: 'Nie „nur kurz“ in die Bib gehen. Du kommst erst zum Abendessen wieder raus.' },
    { title: '👨‍💻 Stack Overflow down?!', text: 'Studierende in ganz Salzburg wurden kurzzeitig von der Realität eingeholt.' },
  ]

  return (
    <div className="w-full max-w-xl space-y-6">
      <h2 className="text-3xl font-bold text-text">News</h2>
      {news.map((n, i) => (
        <div
          key={i}
          className="bg-surface p-6 rounded-xl border border-muted shadow-sm hover:shadow-md hover:scale-[1.01] transition"
        >
          <h3 className="text-xl font-semibold text-primary mb-1">{n.title}</h3>
          <p className="text-muted">{n.text}</p>
        </div>
      ))}
    </div>
  )
}
