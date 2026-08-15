// Category tabs are entirely data-driven (fetched from /api/kriya/categories)
// — whatever the admin adds in Kriya Studio just shows up here, nothing is
// hardcoded to "Flower" / "Paper".
const ElementSidebar = ({ categories, activeCategoryId, onSelectCategory, elements, elementsLoading, onAddElement }) => {
  const activeCategory = categories.find((c) => c._id === activeCategoryId);

  return (
    <div className="bg-white rounded-3xl shadow-soft flex flex-col lg:h-[640px] overflow-hidden">
      {/* Category tabs */}
      <div className="flex lg:flex-col gap-2 p-3 overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto border-b-2 lg:border-b-0 lg:border-r-2 border-ink/5 shrink-0 lg:w-[150px]">
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => onSelectCategory(cat._id)}
            className={`shrink-0 flex lg:flex-col items-center gap-2 lg:gap-1 px-4 py-2.5 lg:py-3 rounded-2xl transition-colors whitespace-nowrap ${
              activeCategoryId === cat._id ? 'bg-rani text-white' : 'bg-blush/60 text-ink/70 hover:bg-blush'
            }`}
          >
            <span className="text-xl">{cat.icon || '🗂️'}</span>
            <span className="text-xs font-display font-semibold">{cat.name}</span>
          </button>
        ))}
        {categories.length === 0 && <p className="text-xs text-ink/40 px-2 py-4">No categories yet.</p>}
      </div>

      {/* Element grid for the selected category */}
      <div className="flex-1 overflow-y-auto p-3">
        {elementsLoading ? (
          <div className="grid grid-cols-4 lg:grid-cols-3 gap-2.5 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-blush/60" />
            ))}
          </div>
        ) : elements.length === 0 ? (
          <p className="text-xs text-ink/40 text-center py-8">
            {activeCategory ? `No ${activeCategory.name.toLowerCase()} elements yet.` : 'Pick a category to see elements.'}
          </p>
        ) : (
          <div className="grid grid-cols-4 lg:grid-cols-3 gap-2.5">
            {elements.map((el) => (
              <button
                key={el._id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', el._id)}
                onClick={() => onAddElement(el)}
                className="group aspect-square rounded-2xl bg-blush/40 hover:bg-blush flex items-center justify-center p-2 transition-colors active:scale-95"
                title={`Add ${el.name}`}
              >
                <img src={el.image} alt={el.name} className="max-w-full max-h-full object-contain drop-shadow-sm group-hover:scale-105 transition-transform" draggable={false} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ElementSidebar;
