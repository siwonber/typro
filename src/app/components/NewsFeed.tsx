'use client'

export default function NewsFeed() {
  const news = [
    { title: '🚀 Version 0.3 ist da!', text: 'Challenges aktiv.' },
    { title: '📚 Erste Studo Woche überlebt!', text: 'Nur 3 Nervenzusammenbrüche und 1 Kaffeevergiftung. Läuft.' },
    { title: '🥐 Mensa-Update:', text: 'Die mysteriöse "Bosna" bleibt unidentifiziert.' },
    { title: '📣 Typing-Turnier nächste Woche!', text: 'Mit Preisen wie Ruhm, Ehre und einem halben Müsliriegel.' },
    { title: '🐛 Bugfixes & Features', text: 'Der Logout-Button funktioniert jetzt wirklich. Versprochen.' },
    { title: '💡 FH Salzburg Pro-Tipp:', text: 'a² + b² = c²' },
    { title: '👨‍💻 Stack Overflow und Chatty down?!', text: 'Studierende in ganz Salzburg wurden kurzzeitig von der Realität eingeholt.' },
  ]

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-4xl space-y-6">
        <h2 className="text-3xl font-bold text-text text-center">News</h2>
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
    </div>
  )
}
