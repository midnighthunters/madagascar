import React from "react";
import {
  UseComboboxGetMenuPropsOptions,
  UseComboboxGetItemPropsOptions,
} from "downshift";
import { cn } from "#/utils/utils";

export interface GenericDropdownMenuProps<T> {
  isOpen: boolean;
  filteredItems: T[];
  inputValue: string;
  highlightedIndex: number;
  selectedItem: T | null;
  getMenuProps: <Options>(
    options?: UseComboboxGetMenuPropsOptions & Options,
  ) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
  getItemProps: <Options>(
    options: UseComboboxGetItemPropsOptions<T> & Options,
  ) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
  onScroll?: (event: React.UIEvent<HTMLUListElement>) => void;
  menuRef?: React.RefObject<HTMLUListElement | null>;
  renderItem: (
    item: T,
    index: number,
    highlightedIndex: number,
    selectedItem: T | null,
    getItemProps: <Options>(
      options: UseComboboxGetItemPropsOptions<T> & Options,
    ) => any, // eslint-disable-line @typescript-eslint/no-explicit-any
  ) => React.ReactNode;
  renderEmptyState: (inputValue: string) => React.ReactNode;
  stickyTopItem?: React.ReactNode;
  stickyFooterItem?: React.ReactNode;
  testId?: string;
  numberOfRecentItems?: number;
  itemKey: (item: T) => string | number;
}

export function GenericDropdownMenu<T>({
  isOpen,
  filteredItems,
  inputValue,
  highlightedIndex,
  selectedItem,
  getMenuProps,
  getItemProps,
  onScroll,
  menuRef,
  renderItem,
  renderEmptyState,
  stickyTopItem,
  stickyFooterItem,
  testId,
  numberOfRecentItems = 0,
  itemKey,
}: GenericDropdownMenuProps<T>) {
  const hasItems = filteredItems.length > 0;
  const showEmptyState = !hasItems && !stickyTopItem && !stickyFooterItem;

  // Always render the menu container (even when closed) so getMenuProps is always called
  // This prevents the downshift warning about forgetting to call getMenuProps
  if (!isOpen) {
    return (
      <div className="relative">
        <ul
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...getMenuProps({
            ref: menuRef,
            className: "hidden",
            "data-testid": testId,
          })}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        className={cn(
          "absolute z-10 w-full bg-white border border-[#D8DCE2] rounded-xl shadow-[0_8px_24px_rgba(20,30,50,0.12)]",
          "focus:outline-none mt-1 z-[9999]",
          stickyTopItem || stickyFooterItem ? "max-h-60" : "max-h-60",
        )}
      >
        <ul
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...getMenuProps({
            ref: menuRef,
            className: cn(
              "w-full overflow-auto p-1 custom-scrollbar-always",
              stickyTopItem || stickyFooterItem
                ? "max-h-[calc(15rem-3rem)]"
                : "max-h-60", // Reserve space for sticky items
            ),
            onScroll,
            "data-testid": testId,
          })}
        >
          {showEmptyState ? (
            renderEmptyState(inputValue)
          ) : (
            <>
              {stickyTopItem}
              {filteredItems.map((item, index) => {
                const key = itemKey(item);
                return (
                  <React.Fragment key={key}>
                    {renderItem(
                      item,
                      index,
                      highlightedIndex,
                      selectedItem,
                      getItemProps,
                    )}
                    {numberOfRecentItems > 0 &&
                      index === numberOfRecentItems - 1 && (
                        <div className="border-b border-[#E7E9ED] bg-white pb-1 mb-1 h-[1px]" />
                      )}
                  </React.Fragment>
                );
              })}
            </>
          )}
        </ul>
        {stickyFooterItem && (
          <div className="border-t border-[#E7E9ED] bg-white p-1 rounded-b-xl">
            {stickyFooterItem}
          </div>
        )}
      </div>
    </div>
  );
}
