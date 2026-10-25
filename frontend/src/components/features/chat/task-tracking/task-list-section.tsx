import { useTranslation } from "react-i18next";
import { TaskItem } from "./task-item";
import LessonPlanIcon from "#/icons/lesson-plan.svg?react";
import { I18nKey } from "#/i18n/declaration";
import { Typography } from "#/ui/typography";

interface TaskListSectionProps {
  taskList: Array<{
    id: string;
    title: string;
    status: "todo" | "in_progress" | "done";
    notes?: string;
  }>;
}

export function TaskListSection({ taskList }: TaskListSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col overflow-clip bg-surface-muted border border-line rounded-[14px] w-full text-ink">
      {/* Header Tabs */}
      <div className="flex gap-1 items-center border-b border-line h-[41px] px-2 shrink-0">
        <LessonPlanIcon className="shrink-0 w-4.5 h-4.5 text-ink-muted" />
        <Typography.Text className="text-[11px] text-nowrap text-ink tracking-[0.11px] font-medium leading-[16px] whitespace-pre">
          {t(I18nKey.COMMON$TASKS)}
        </Typography.Text>
      </div>

      {/* Task Items */}
      <div>
        {taskList.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
