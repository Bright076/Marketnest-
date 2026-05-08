"use client";

interface CategoryBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: "all", name: "All", icon: "🛍️" },
  { id: "phones", name: "Phones", icon: "📱" },
  { id: "powerbanks", name: "Power Banks", icon: "🔋" },
  { id: "audio", name: "Audio", icon: "🎧" },
  { id: "tablets", name: "Tablets", icon: "📱" },
  { id: "laptops", name: "Laptops", icon: "💻" },
  { id: "speakers", name: "Speakers", icon: "🔊" },
  { id: "chargers", name: "Chargers", icon: "🔌" },
  { id: "others", name: "Others", icon: "📦" },
];

export default function CategoryBar({ selectedCategory, onCategoryChange }: CategoryBarProps) {
  return (
    <div
      style={{
        background: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: "60px",
        zIndex: 40,
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "0.4rem",
            overflowX: "auto",
            overflowY: "hidden",
            padding: "0.75rem 0",
            scrollbarWidth: "thin",
            scrollbarColor: "#d1d5db #f3f4f6",
          }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.4rem 0.85rem",
                borderRadius: "9999px",
                border: "none",
                background:
                  selectedCategory === category.id
                    ? "#16a34a"
                    : "#f3f4f6",
                color:
                  selectedCategory === category.id
                    ? "#ffffff"
                    : "#374151",
                fontWeight: 600,
                fontSize: "0.8rem",
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                if (selectedCategory !== category.id) {
                  e.currentTarget.style.background = "#e5e7eb";
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== category.id) {
                  e.currentTarget.style.background = "#f3f4f6";
                }
              }}
            >
              <span style={{ fontSize: "0.95rem" }}>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        /* Custom scrollbar styling */
        div::-webkit-scrollbar {
          height: 6px;
        }
        div::-webkit-scrollbar-track {
          background: #f3f4f6;
        }
        div::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}} />
    </div>
  );
}
