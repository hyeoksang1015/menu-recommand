"use client";

// 칩 묶음. multiple이면 여러 개, 아니면 하나만 고른다. 누른 상태는 aria-pressed로 알린다.
export default function Chips<K extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { key: K; label: string }[];
  value: K | K[];
  onChange: (key: K) => void;
}) {
  const on = (k: K) => (Array.isArray(value) ? value.includes(k) : value === k);
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          className="chip"
          aria-pressed={on(o.key)}
          onClick={() => onChange(o.key)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
