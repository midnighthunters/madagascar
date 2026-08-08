interface TaskIssueNumberProps {
  issueNumber: number;
  href: string;
}

export function TaskIssueNumber({ href, issueNumber }: TaskIssueNumberProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="task-id"
    >
      <span className="text-xs text-[#725E19] leading-4 font-semibold hover:underline">
        #{issueNumber}
      </span>
    </a>
  );
}
