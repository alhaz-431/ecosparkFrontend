export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-800 to-emerald-600 text-white py-24 px-6 text-center">
        <h1 className="text-5xl font-extrabold mb-4">About EcoSpark Hub 🌱</h1>
        <p className="text-xl text-green-100 max-w-2xl mx-auto">
          We are a community-driven platform empowering people to share and discover sustainability ideas that make a real difference.
        </p>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Our Mission 🎯</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              EcoSpark Hub was founded with a simple belief: every person has the power to make a positive impact on our planet. We created this platform to bring together eco-conscious individuals, innovators, and changemakers.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Our mission is to democratize sustainability by making it easy for anyone to share ideas, get feedback, and inspire others to take action.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🌍', title: 'Global Impact', desc: 'Ideas from 50+ countries' },
              { icon: '💡', title: 'Innovation', desc: '500+ ideas shared' },
              { icon: '👥', title: 'Community', desc: '10,000+ members' },
              { icon: '♻️', title: 'Sustainability', desc: '200+ approved ideas' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl shadow text-center">
                <div className="text-4xl mb-2">{item.icon}</div>
                <div className="font-bold text-gray-800">{item.title}</div>
                <div className="text-sm text-gray-500">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-12">Our Values 💚</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🤝', title: 'Community First', desc: 'We believe in the power of collective action. Every idea shared is a step towards a better world.' },
              { icon: '🔬', title: 'Innovation', desc: 'We encourage creative thinking and out-of-the-box solutions to environmental challenges.' },
              { icon: '🌿', title: 'Sustainability', desc: 'Every feature we build is designed with environmental impact in mind.' },
            ].map((val, i) => (
              <div key={i} className="text-center p-6 rounded-2xl bg-gray-50">
                <div className="text-5xl mb-4">{val.icon}</div>
                <h3 className="font-bold text-xl text-gray-800 mb-2">{val.title}</h3>
                <p className="text-gray-500">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-12">Our Team 👨‍💻</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: 'Alhaz', role: 'Founder & Developer', emoji: '👨‍💻', desc: 'Passionate about sustainability and technology.' },
            { name: 'Sarah K.', role: 'Environmental Expert', emoji: '👩‍🔬', desc: 'PhD in Environmental Science with 10 years experience.' },
            { name: 'Ahmed R.', role: 'Community Manager', emoji: '👨‍💼', desc: 'Building bridges between ideas and real-world impact.' },
          ].map((member, i) => (
            <div key={i} className="bg-white rounded-2xl shadow p-6 text-center hover:shadow-lg transition">
              <div className="text-6xl mb-4">{member.emoji}</div>
              <h3 className="font-bold text-xl text-gray-800">{member.name}</h3>
              <p className="text-green-700 font-medium text-sm mb-2">{member.role}</p>
              <p className="text-gray-500 text-sm">{member.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-green-700 to-emerald-600 text-white py-20 px-6 text-center">
        <h2 className="text-3xl font-extrabold mb-4">Join Our Mission 🚀</h2>
        <p className="text-green-100 text-lg mb-8 max-w-xl mx-auto">
          Be part of the change. Share your sustainability ideas and inspire thousands of people around the world.
        </p>
        <a href="/login" className="bg-white text-green-700 px-10 py-4 rounded-full text-lg font-bold hover:bg-green-100 transition shadow-lg inline-block">
          Get Started Free →
        </a>
      </section>
    </div>
  );
}