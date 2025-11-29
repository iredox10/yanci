const SectionContainer = ({ title, children, accent = '#052962', ctaLabel = 'Duba duka' }) => (
  <section className="mb-12">
    <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-4">
      <h2 className="text-xl font-bold" style={{ color: accent }}>
        {title}
      </h2>
      <a href="#" className="text-xs font-bold hover:underline" style={{ color: accent }}>
        {ctaLabel}
      </a>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {children}
    </div>
  </section>
);

export default SectionContainer;
