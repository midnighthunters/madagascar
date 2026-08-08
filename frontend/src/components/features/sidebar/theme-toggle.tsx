import { Moon, Sun } from "lucide-react";
import { Button } from "#/ui/button";
import { useTheme } from "#/hooks/use-theme";
import { StyledTooltip } from "#/components/shared/buttons/styled-tooltip";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";

  return (
    <StyledTooltip content={label} placement="right">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        aria-label={label}
        aria-pressed={isDark}
        className="md:w-full md:justify-start md:px-3"
      >
        {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
        <span className="hidden md:inline">{isDark ? "Light" : "Dark"}</span>
      </Button>
    </StyledTooltip>
  );
}
