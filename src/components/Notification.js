import React, { useState, useContext } from "react";
import { Drawer, Card } from "antd";
import { createStyles, useTheme } from "antd-style";
import CustomModal from "../components/Modal";
import { AppContext } from "../context/AppContext";

const useStyle = createStyles(({ token }) => ({
  "my-drawer-body": { background: token.blue1 },
  "my-drawer-mask": { boxShadow: `inset 0 0 15px #fff` },
  "my-drawer-header": { background: token.green1 },
  "my-drawer-footer": { color: token.colorPrimary },
}));

const getProfilePictureUrl = (profilePicture) => {
  const defaultAvatar = "data:image/svg+xml;base64,...";
  if (!profilePicture) return defaultAvatar;

  if (
    typeof profilePicture === "string" &&
    profilePicture.startsWith("data:image")
  ) {
    return profilePicture;
  }

  if (typeof profilePicture === "object") {
    if (profilePicture.data && profilePicture.contentType) {
      return `data:${profilePicture.contentType};base64,${profilePicture.data}`;
    }
    if (profilePicture.url) return profilePicture.url;
  }

  return defaultAvatar;
};

const Notification = ({ open, onClose }) => {
  const { styles } = useStyle();
  const token = useTheme();
  const { notificationqueue } = useContext(AppContext);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const classNames = {
    body: styles["my-drawer-body"],
    mask: styles["my-drawer-mask"],
    header: styles["my-drawer-header"],
    footer: styles["my-drawer-footer"],
  };

  const drawerStyles = {
    mask: { backdropFilter: "blur(10px)" },
    content: { boxShadow: "-10px 0 10px #666" },
    header: { borderBottom: `1px solid ${token.colorPrimary}` },
    body: { padding: 5, fontSize: token.fontSizeLG },
    footer: { borderTop: `1px solid ${token.colorBorder}` },
  };

  const getCorrectValue = (item, field) =>
    item.changes?.[field]?.to ??
    item[field] ??
    item.memberData?.[field] ??
    item.originalData?.[field] ??
    null;

  const safeStringify = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object") {
      if (value.name) return value.name;
      return JSON.stringify(value);
    }
    return String(value);
  };

  const getTeamNames = (team) => {
    if (!team) return "";
    if (Array.isArray(team)) return team.map((t) => t?.name || t).join(", ");
    if (typeof team === "object") return team.name || String(team);
    return String(team);
  };

  const membersData = Array.isArray(notificationqueue)
    ? notificationqueue.map((item) => {
        const profilePictureRaw =
          item.changes?.profilePicture?.to ||
          item.profilePicture ||
          item.memberData?.profilePicture ||
          item.originalData?.profilePicture;

        return {
          key: item.key || item.memberData?._id || Math.random().toString(),
          name: safeStringify(getCorrectValue(item, "name")),
          email: safeStringify(getCorrectValue(item, "email")),
          designation: safeStringify(getCorrectValue(item, "designation")),
          designationText: safeStringify(getCorrectValue(item, "designation")),
          team: getTeamNames(getCorrectValue(item, "team")),
          doj: safeStringify(getCorrectValue(item, "doj")),
          dob: safeStringify(getCorrectValue(item, "dob")),
          yoe: safeStringify(getCorrectValue(item, "yoe")),
          about: safeStringify(
            getCorrectValue(item, "bio") || getCorrectValue(item, "about")
          ),
          profilePicture: getProfilePictureUrl(profilePictureRaw),
          requestType: item.requestType,
          requestedBy: safeStringify(item.requestedBy),
          requestedAt: item.requestedAt,
          changes: item.changes,
          originalData: item.originalData,
          memberData: item.memberData,
        };
      })
    : [];

  const handleOpen = (member) => {
    setSelectedMember({ ...member, _forceUpdate: Date.now() });
    setIsModalOpen(true);
  };

  const handleOk = (data) => {
    console.log("Modal submitted:", data);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  console.log(notificationqueue, "queue");

  return (
    <>
      <Drawer
        title="Notifications"
        placement="right"
        open={open}
        onClose={onClose}
        width={400}
        classNames={classNames}
        styles={drawerStyles}
        className="!p-2"
      >
        {membersData.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-lg mb-2">No Notifications</div>
            <div className="text-sm">You're all caught up!</div>
          </div>
        ) : (
          membersData.map((member) => (
            <Card
              key={member.key}
              className="relative mb-3 cursor-pointer border border-gray-300 hover:border-blue-500 transition-colors duration-200"
              style={{ width: "100%" }}
              bodyStyle={{ padding: 12 }}
              onClick={() => handleOpen(member)}
            >
              {member.requestType && (
                <div className="absolute top-2 right-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {member.requestType.replace("_", " ").toUpperCase()}
                </div>
              )}
              <div className="flex items-center gap-3">
                <img
                  src={member.profilePicture}
                  alt={member.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) => (e.target.src = getProfilePictureUrl(null))}
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">
                    {member.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {member.designation}
                  </div>
                  <div className="text-xs text-gray-400">{member.team}</div>
                  {member.requestedAt && (
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(member.requestedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </Drawer>

      {selectedMember && (
        <CustomModal
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          selectedMember={selectedMember}
          key={selectedMember._forceUpdate}
        />
      )}
    </>
  );
};

export default Notification;
