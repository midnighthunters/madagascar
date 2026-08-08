export function TaskItemTitle({ children: title }: React.PropsWithChildren) {
  return (
    <div className="py-3">
      <h3 className="text-xs text-ink-secondary leading-6 font-medium">{title}</h3>
    </div>
  );
}
