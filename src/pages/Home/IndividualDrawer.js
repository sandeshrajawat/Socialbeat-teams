import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useContext,
} from "react";
import { Drawer, Table, Image } from "antd";
import { createStyles, useTheme } from "antd-style";
import { AppContext } from "../../context/AppContext";
import "./Home.css";

const useStyle = createStyles(({ token }) => ({
  "my-drawer-body": {
    background: token.blue1,
  },
  "my-drawer-mask": {
    boxShadow: "inset 0 0 15px #fff",
  },
  "my-drawer-header": {
    background: token.green1,
  },
  "my-drawer-footer": {
    color: token.colorPrimary,
  },
}));

const IndividualDrawer = forwardRef((_, ref) => {
  
  

  console.log("trigger 2 ")
  const [open, setOpen] = useState(false);
  const { styles } = useStyle();
  const token = useTheme();
  const { currentUser } = useContext(AppContext);

  useImperativeHandle(ref, () => ({
    openDrawer: () => setOpen(true),
    closeDrawer: () => setOpen(false),
  }));

  const classNames = {
    body: styles["my-drawer-body"],
    mask: styles["my-drawer-mask"],
    header: styles["my-drawer-header"],
    footer: styles["my-drawer-footer"],
    content: styles["my-drawer-content"],
  };

  const drawerStyles = {
    mask: {
      backdropFilter: "blur(8px)",
    },
    content: {
      boxShadow: "-10px 0 20px rgba(0,0,0,0.2)",
    },
    header: {
      borderBottom: `1px solid ${token.colorPrimary}`,
    },
    body: {
      fontSize: token.fontSizeLG,
      padding: "24px",
    },
  };



  const userData = currentUser
    ? [
        {
          property: "Profile Picture",
          value: currentUser.profilePicture ? (
            <Image
              width={100}
              src={currentUser.profilePicture}
              alt="Profile"
              fallback="/default-avatar.png"
            />
          ) : (
            "No profile picture"
          ),
        },
        { property: "Name", value: currentUser.name || "null" },
        { property: "Email", value: currentUser.email || "null" },
        { property: "Designation", value: currentUser.designation || "null" },
        { property: "Team", value: currentUser.team || "null" },
        { property: "Date of Joining", value: currentUser.doj || "null" },
        { property: "Date of Birth", value: currentUser.dob || "null" },
        {
          property: "About",
          value: (
            <div style={{ whiteSpace: "pre-wrap" }}>
              {currentUser.about || "N/A"}
            </div>
          ),
        },
      ]
    : [];

  return (
    <Drawer
      title={currentUser?.name}
      placement="right"
      width={420}
      onClose={() => setOpen(false)}
      open={open}
      classNames={classNames}
      styles={drawerStyles}
    >
      {currentUser ? (
        <Table
          dataSource={userData}
          columns={[
            {
              title: "Property",
              dataIndex: "property",
              key: "property",
              width: "40%",
            },
            {
              title: "Value",
              dataIndex: "value",
              key: "value",
            },
          ]}
          pagination={false}
          rowKey="property"
          size="middle"
          bordered
          showHeader={false}
        />
      ) : (
        <p>No user data available</p>
      )}
    </Drawer>
  );
});

export default IndividualDrawer;
