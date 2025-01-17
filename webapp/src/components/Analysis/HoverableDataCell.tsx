import React from "react";
import { Box, Paper, Popper } from "@mui/material";
import { gridClasses } from "@mui/x-data-grid";

function isOverflown(element: Element) {
  return element.scrollWidth > element.clientWidth;
}

type GridCellExpandProps = {
  autoWidth?: boolean;
  children: React.ReactNode;
};

const HoverableDataCell = (props: GridCellExpandProps) => {
  const { autoWidth = false, children } = props;

  const wrapper = React.useRef<HTMLDivElement | null>(null);
  const cellDiv = React.useRef(null);
  const cellValue = React.useRef(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showFullCell, setShowFullCell] = React.useState(false);
  const [showPopper, setShowPopper] = React.useState(false);

  const handleMouseEnter = () => {
    const isCurrentlyOverflown = isOverflown(cellValue.current!);
    setShowPopper(isCurrentlyOverflown);
    setAnchorEl(cellDiv.current);
    setShowFullCell(true);
  };

  const handleMouseLeave = () => {
    setShowFullCell(false);
  };

  React.useEffect(() => {
    if (!showFullCell) {
      return undefined;
    }

    function handleKeyDown(nativeEvent: KeyboardEvent) {
      if (nativeEvent.key === "Escape") {
        setShowFullCell(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [setShowFullCell, showFullCell]);

  return (
    <>
      <div ref={cellValue} className={gridClasses.cellContent}>
        {children}
      </div>
      <Box
        ref={wrapper}
        height="100%"
        width="100%"
        position="absolute"
        top={0}
        left={0}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Box ref={cellDiv} />
      </Box>
      {showPopper && (
        <Popper
          open={showFullCell && anchorEl !== null}
          placement="bottom-start"
          anchorEl={anchorEl}
          style={{
            ...(!autoWidth && { width: wrapper.current!.offsetWidth }),
            pointerEvents: "none", // Because of that, avoid nesting anything
            // that relies on pointer events like click, hover or scroll.
          }}
        >
          <Paper
            elevation={2}
            sx={{
              minHeight: wrapper.current!.offsetHeight,
              padding: "10px",
              paddingBottom: "12px",
              display: "flex",
              alignItems: "center",
              // Replicate some style normally inherited from DataGrid's root.
              // Unfortunately, gridClasses.root doesn't work, so duplicating:
              fontSize: 14,
              fontWeight: 500,
              lineHeight: 1.55,
              fontFamily: "Gilroy",
              outline: "none",
            }}
          >
            {children}
          </Paper>
        </Popper>
      )}
    </>
  );
};

export default HoverableDataCell;
