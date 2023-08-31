import { useEffect, useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Avatar, Box, IconButton, Typography, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/store";
import { layoutActions } from "../../store/layout/layoutSlice";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import ApartmentIcon from "@mui/icons-material/Apartment";
import WysiwygIcon from "@mui/icons-material/Wysiwyg";
import GroupIcon from "@mui/icons-material/Group";
import CategoryIcon from "@mui/icons-material/Category";
import LogoutIcon from "@mui/icons-material/Logout";
import InfoIcon from "@mui/icons-material/Info";
import { authActions } from "../../store/auth/authSlice";
import { colorToken } from "../../theme/colorToken";
import userImageDefault from "../../assets/user/user.png";

const Item = ({ title, to, icon, selected, setSelected, navigate }: any) => {
  return (
    <MenuItem
      active={selected.toLowerCase() === title.toLowerCase()}
      onClick={() => {
        setSelected(title);
        navigate(to);
      }}
      icon={icon}
    >
      <Typography fontWeight="500">{title}</Typography>
    </MenuItem>
  );
};

const SidebarCustom = () => {
  const theme = useTheme();
  const [openOrganizerMenu, setOpenOrganizerMenu] = useState<boolean>(false);

  //test theme
  const mode = useAppSelector((state) => state.layout.theme);
  const colors = colorToken(mode);

  const userInfo = useAppSelector((state) => state.auth.dataUser);
  const location = useLocation();
  const path = location.pathname.replace("/", "");
  const isCollapseSidebar = useAppSelector(
    (state) => state.layout.isCollapseSidebar
  );
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("");

  useEffect(() => {
    setSelected(path);
  }, [path]);

  useEffect(() => {
    if (
      path === "organizer/info" ||
      path === "organizer/products" ||
      path === "organizer/consignments" ||
      path.includes("organizer/products") ||
      path.includes("organizer/consignments")
    ) {
      setOpenOrganizerMenu(true);
    }
  }, [path]);

  const handleLogout = async () => {
    dispatch(
      authActions.logout({
        onNavigate: () => navigate("/login"),
      })
    );
  };

  return (
    <Box
      sx={{
        bgcolor: `${colors.sidebar.background}`,
        "& .ps-sidebar-root": {
          height: "100%",
          px: 1,
          borderRight: `1px solid ${colors.sidebar.border} !important`,
        },
        "& .ps-sidebar-container": {
          bgcolor: `${colors.sidebar.background} !important`,
        },
        "& .ps-active": {
          bgcolor: `${colors.sidebar.bgselect}`,
          borderRadius: 2,
        },
        "& .ps-menuitem-root.ps-active > .ps-menu-button:hover": {
          bgcolor: `${colors.sidebar.bgselect}`,
          borderRadius: 2,
        },
        "& .ps-menuitem-root > .ps-menu-button:hover": {
          bgcolor: `${colors.sidebar.bghover}`,
          borderRadius: 2,
        },
        "& .ps-menu-button": {
          borderRadius: 2,
          paddingLeft: "15px !important",
        },
        "& .ps-submenu-content": {
          padding: "4px",
          background: `${theme.palette.background.default} !important`,
          transition: `height 300ms !important`,
          display: openOrganizerMenu ? `block !important` : `none !important`,
          height: openOrganizerMenu ? `auto !important` : `0px !important`,
        },
        "& .ps-submenu-content.ps-open": {
          marginTop: isCollapseSidebar ? "80px !important" : "0",
        },
        "& .ps-menuitem-root": {
          marginBottom: "4px",
          borderRadius: 2,
        },
        position: "fixed",
        top: 0,
        bottom: 0,
        overflow: "auto",
      }}
    >
      <Sidebar collapsed={isCollapseSidebar}>
        <Menu>
          {/* LOGO AND MENU ICON */}
          <MenuItem
            onClick={() => dispatch(layoutActions.toggleCollapseSidebar())}
            icon={isCollapseSidebar ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "0 0 20px 0",
              //   color: colors.grey[100],
            }}
          >
            {!isCollapseSidebar && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
                sx={{ py: "15px" }}
              >
                <Typography variant="h3">E-Product ID</Typography>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(layoutActions.toggleCollapseSidebar());
                  }}
                >
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {!isCollapseSidebar && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <Avatar
                  sx={{ width: 80, height: 80 }}
                  alt={userInfo?.name}
                  src={userImageDefault}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h2"
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {userInfo?.name}
                </Typography>
                <Typography variant="h5">{userInfo?.email}</Typography>
              </Box>
            </Box>
          )}

          <Box>
            {/* <Item
              title="Dashboard"
              navigate={navigate}
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            {/* <Item
              navigate={navigate}
              title="Product"
              to="/product"
              icon={<CategoryIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            <SubMenu
              defaultOpen={openOrganizerMenu}
              open={openOrganizerMenu}
              onOpenChange={() => {
                setOpenOrganizerMenu(!openOrganizerMenu);
              }}
              icon={<ApartmentIcon />}
              label={<Typography fontWeight="500">Tổ chức của bạn</Typography>}
            >
              {/* <MenuItem
                active={selected.toLowerCase() === "organizer/info"}
                onClick={() => {
                  setSelected("organizer/info");
                  navigate("/organizer/info");
                }}
                icon={<InfoIcon />}
              >
                <Typography fontWeight="500">Thông tin về tổ chức</Typography>
              </MenuItem> */}
              <MenuItem
                active={selected.toLowerCase().includes("organizer/products")}
                onClick={() => {
                  setSelected("organizer/products");
                  navigate("/organizer/products");
                }}
                icon={<CategoryIcon />}
              >
                <Typography fontWeight="500">Sản phẩm</Typography>
              </MenuItem>
              <MenuItem
                active={
                  selected.toLowerCase() === "organizer/consignments" ||
                  selected.toLowerCase().includes("organizer/consignments")
                }
                onClick={() => {
                  setSelected("organizer/consignments");
                  navigate("/organizer/consignments");
                }}
                icon={<WysiwygIcon />}
              >
                <Typography fontWeight="500">Lô hàng</Typography>
              </MenuItem>
              {/* <MenuItem
                active={selected.toLowerCase() === "organizer/members"}
                onClick={() => {
                  setSelected("organizer/members");
                  navigate("/organizer/members");
                }}
                icon={<GroupIcon />}
              >
                <Typography fontWeight="500">Thành viên</Typography>
              </MenuItem> */}
            </SubMenu>
            {!isCollapseSidebar && (
              <Typography variant="h6" sx={{ m: "15px 0 5px 20px" }}>
                Cài đặt
              </Typography>
            )}
            <MenuItem
              style={{ marginTop: "8px" }}
              onClick={handleLogout}
              icon={<LogoutIcon />}
            >
              <Typography>Đăng xuất</Typography>
            </MenuItem>
          </Box>
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default SidebarCustom;
