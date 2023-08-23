import { Box, Paper, useTheme } from "@mui/material";
import Navbar from "../../components/layout/Navbar";
import SidebarCustom from "../../components/layout/Sidebar";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import CreateAndEditProductModal from "../../components/modal/product/CreateAndEditProduct";
import LoadingOverLay from "../../components/LoadingOverLay";
import { colorToken } from "../../theme/colorToken";
import ConfirmModal from "../../components/modal/ConfirmModal";
import CreateConsignmentModal from "../../components/modal/consignment/CreateConsignment";
import CreateChainsModal from "../../components/modal/chains/CreateChainsModal";
import { useEffect } from "react";
import { organizerActions } from "../../store/organizer/info/organizerSlice";
import CreateOrganizerModal from "../../components/modal/organizer/CreateOrganizerModal";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const isCollapseSidebar = useAppSelector(
    (state) => state.layout.isCollapseSidebar
  );

  //test theme
  const mode = useAppSelector((state) => state.layout.theme);
  const colors = colorToken(mode);

  return (
    <>
      <SidebarCustom />
      <main
        className="content"
        style={
          !isCollapseSidebar
            ? { paddingLeft: "250px", transition: "padding 0.3s ease" }
            : { paddingLeft: "80px", transition: "padding 0.3s ease" }
        }
      >
        <Navbar />
        <Box sx={{ px: 4, pb: 4, bgcolor: colors.background.main }}>
          <Paper sx={{ minHeight: "85vh" }}>{children}</Paper>
        </Box>
        <CreateOrganizerModal />
        <CreateAndEditProductModal />
        <CreateConsignmentModal />
        <CreateChainsModal />
        <ConfirmModal />
        <LoadingOverLay />
      </main>
    </>
  );
};
export default MainLayout;
