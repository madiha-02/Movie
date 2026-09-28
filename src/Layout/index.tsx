import { ReactNode } from "react";
import { Box } from "@mui/material";
import Navbar from "../components/navbar";

interface LayoutProps {
  children: ReactNode;
  search?: ReactNode;
}

const Layout = ({ children, search }: LayoutProps) => {
  return (
    <Box
      sx={{
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        color: "text.primary",
        padding: { xs: 1.5, sm: 3 },
        gap: { xs: 1.5, sm: 3 },
        height: "100vh",
        overflowY: "hidden",
      }}
    >
      <Navbar search={search} />
      <Box sx={{ width: "100%", flex: 1, overflowY: "scroll" }}>{children}</Box>
    </Box>
  );
};

export default Layout;
