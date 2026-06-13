import React from "react";
import Svg, { Path, Circle, G, ClipPath, Rect, Defs } from "react-native-svg";

export const GoogleIcon = ({ size = 18 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <Path
      d="M16.92 9.1875C16.92 8.6025 16.8675 8.04 16.77 7.5H9V10.695H13.44C13.245 11.7225 12.66 12.5925 11.7825 13.1775V15.255H14.46C16.02 13.815 16.92 11.7 16.92 9.1875Z"
      fill="#4285F4"
    />
    <Path
      d="M9 17.2502C11.2275 17.2502 13.095 16.5152 14.46 15.2552L11.7825 13.1777C11.0475 13.6727 10.11 13.9727 9 13.9727C6.855 13.9727 5.0325 12.5252 4.38 10.5752H1.635V12.7052C2.9925 15.3977 5.775 17.2502 9 17.2502Z"
      fill="#34A853"
    />
    <Path
      d="M4.38 10.5677C4.215 10.0727 4.1175 9.54773 4.1175 9.00023C4.1175 8.45273 4.215 7.92773 4.38 7.43273V5.30273H1.635C1.0725 6.41273 0.75 7.66523 0.75 9.00023C0.75 10.3352 1.0725 11.5877 1.635 12.6977L3.7725 11.0327L4.38 10.5677Z"
      fill="#FBBC05"
    />
    <Path
      d="M9 4.035C10.215 4.035 11.295 4.455 12.1575 5.265L14.52 2.9025C13.0875 1.5675 11.2275 0.75 9 0.75C5.775 0.75 2.9925 2.6025 1.635 5.3025L4.38 7.4325C5.0325 5.4825 6.855 4.035 9 4.035Z"
      fill="#EA4335"
    />
  </Svg>
);

export const AppleIcon = ({ size = 20 }: { size?: number }) => (
  <Svg width={size * (17 / 20)} height={size} viewBox="0 0 17 20" fill="none">
    <Path
      d="M13.2529 15.3123C12.665 16.1907 12.0417 17.0478 11.0925 17.0619C10.1433 17.0832 9.83875 16.5023 8.76208 16.5023C7.67833 16.5023 7.34542 17.0478 6.44583 17.0832C5.51792 17.1186 4.81667 16.1482 4.22167 15.2911C3.01042 13.5415 2.0825 10.3186 3.32917 8.15109C3.94542 7.07442 5.05042 6.39442 6.2475 6.37317C7.15417 6.359 8.01833 6.98942 8.57792 6.98942C9.13042 6.98942 10.1787 6.2315 11.2696 6.34484C11.73 6.36609 13.0192 6.529 13.8479 7.74734C13.7842 7.78984 12.3108 8.654 12.325 10.4461C12.3462 12.5853 14.2021 13.3007 14.2233 13.3078C14.2021 13.3573 13.9258 14.3278 13.2458 15.3123M9.20833 3.979C9.72542 3.39109 10.5825 2.94484 11.2908 2.9165C11.3829 3.74525 11.05 4.58109 10.5542 5.17609C10.0654 5.77817 9.25792 6.24567 8.46458 6.18192C8.35833 5.36734 8.755 4.51734 9.20833 3.979Z"
      fill="white"
    />
  </Svg>
);

export const EmailIcon = ({ size = 15 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 15 15" fill="none">
    <Path
      d="M2.5 2.5H12.5C13.1875 2.5 13.75 3.0625 13.75 3.75V11.25C13.75 11.9375 13.1875 12.5 12.5 12.5H2.5C1.8125 12.5 1.25 11.9375 1.25 11.25V3.75C1.25 3.0625 1.8125 2.5 2.5 2.5Z"
      stroke="#8E9BAE"
      strokeWidth="1.125"
      strokeLinecap="round"
    />
    <Path
      d="M13.75 3.75L7.5 8.125L1.25 3.75"
      stroke="#8E9BAE"
      strokeWidth="1.125"
      strokeLinecap="round"
    />
  </Svg>
);

export const PasswordIcon = ({ size = 15, color = "#8E9BAE" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 15 15" fill="none">
    <Path
      d="M11.875 6.875H3.125C2.43464 6.875 1.875 7.43464 1.875 8.125V12.5C1.875 13.1904 2.43464 13.75 3.125 13.75H11.875C12.5654 13.75 13.125 13.1904 13.125 12.5V8.125C13.125 7.43464 12.5654 6.875 11.875 6.875Z"
      stroke={color}
      strokeWidth="1.125"
      strokeLinecap="round"
    />
    <Path
      d="M4.375 6.875V4.375C4.375 3.5462 4.70424 2.75134 5.29029 2.16529C5.87634 1.57924 6.6712 1.25 7.5 1.25C8.3288 1.25 9.12366 1.57924 9.70971 2.16529C10.2958 2.75134 10.625 3.5462 10.625 4.375V6.875"
      stroke={color}
      strokeWidth="1.125"
      strokeLinecap="round"
    />
  </Svg>
);

export const SearchIcon = ({ size = 15 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 15 15" fill="none">
    <Path
      d="M6.875 11.875C9.63642 11.875 11.875 9.63642 11.875 6.875C11.875 4.11358 9.63642 1.875 6.875 1.875C4.11358 1.875 1.875 4.11358 1.875 6.875C1.875 9.63642 4.11358 11.875 6.875 11.875Z"
      stroke="#8E9BAE"
      strokeWidth="1.25"
      strokeLinecap="round"
    />
    <Path
      d="M13.125 13.125L10.4062 10.4062"
      stroke="#8E9BAE"
      strokeWidth="1.25"
      strokeLinecap="round"
    />
  </Svg>
);

export const HomeIcon = ({ size = 21, color = "#CCFF00" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 21 21" fill="none">
    <Path
      d="M2.625 7.875L10.5 1.75L18.375 7.875V17.5C18.375 17.9641 18.1906 18.4092 17.8624 18.7374C17.5342 19.0656 17.0891 19.25 16.625 19.25H4.375C3.91087 19.25 3.46575 19.0656 3.13756 18.7374C2.80937 18.4092 2.625 17.9641 2.625 17.5V7.875Z"
      fill={color}
    />
    <Path d="M7.875 19.25V10.5H13.125V19.25" stroke="#0D1317" strokeWidth="1.3125" />
  </Svg>
);

export const PitchIcon = ({ size = 21, color = "#8E9BAE" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 21 21" fill="none">
    <Path
      d="M16.625 2.625H4.375C2.92525 2.625 1.75 3.80025 1.75 5.25V15.75C1.75 17.1997 2.92525 18.375 4.375 18.375H16.625C18.0747 18.375 19.25 17.1997 19.25 15.75V5.25C19.25 3.80025 18.0747 2.625 16.625 2.625Z"
      stroke={color}
      strokeWidth="1.575"
      strokeLinecap="round"
    />
    <Path d="M1.75 10.5H19.25" stroke={color} strokeWidth="1.575" strokeLinecap="round" />
    <Path d="M10.5 2.625V18.375" stroke={color} strokeWidth="1.575" strokeLinecap="round" />
  </Svg>
);

export const ChatIcon = ({ size = 21, color = "#8E9BAE" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 21 21" fill="none">
    <Path
      d="M18.375 13.125C18.375 13.5891 18.1906 14.0342 17.8624 14.3624C17.5342 14.6906 17.0891 14.875 16.625 14.875H6.125L2.625 18.375V4.375C2.625 3.91087 2.80937 3.46575 3.13756 3.13756C3.46575 2.80937 3.91087 2.625 4.375 2.625H16.625C17.0891 2.625 17.5342 2.80937 17.8624 3.13756C18.1906 3.46575 18.375 3.91087 18.375 4.375V13.125Z"
      stroke={color}
      strokeWidth="1.575"
      strokeLinecap="round"
    />
  </Svg>
);

export const ProfileIcon = ({ size = 21, color = "#8E9BAE" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 21 21" fill="none">
    <Path
      d="M17.5 18.375V16.625C17.5 15.6967 17.1313 14.8065 16.4749 14.1501C15.8185 13.4937 14.9283 13.125 14 13.125H7C6.07174 13.125 5.1815 13.4937 4.52513 14.1501C3.86875 14.8065 3.5 15.6967 3.5 16.625V18.375"
      stroke={color}
      strokeWidth="1.575"
      strokeLinecap="round"
    />
    <Path
      d="M10.5 9.625C12.433 9.625 14 8.058 14 6.125C14 4.192 12.433 2.625 10.5 2.625C8.567 2.625 7 4.192 7 6.125C7 8.058 8.567 9.625 10.5 9.625Z"
      stroke={color}
      strokeWidth="1.575"
      strokeLinecap="round"
    />
  </Svg>
);

export const EyeIcon = ({ size = 18, color = "#8E9BAE" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle
      cx="12"
      cy="12"
      r="3"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const EyeOffIcon = ({ size = 18, color = "#8E9BAE" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24M1 1l22 22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SyncIcon = ({ size = 15, color = "black" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 15 15" fill="none">
    <G clipPath="url(#clip0_15_5045)">
      <Path d="M0.625 2.5V6.25H4.375" stroke={color} strokeWidth="1.5625" strokeLinecap="round"/>
      <Path d="M14.375 12.5V8.75H10.625" stroke={color} strokeWidth="1.5625" strokeLinecap="round"/>
      <Path d="M12.8062 5.62547C12.4893 4.72972 11.9505 3.92885 11.2403 3.29761C10.5301 2.66637 9.67158 2.22533 8.74482 2.01564C7.81806 1.80594 6.85328 1.83444 5.94051 2.09846C5.02773 2.36248 4.19672 2.85342 3.525 3.52547L0.625 6.25047M14.375 8.75047L11.475 11.4755C10.8033 12.1475 9.97227 12.6385 9.05949 12.9025C8.14672 13.1665 7.18194 13.195 6.25518 12.9853C5.32842 12.7756 4.46988 12.3346 3.75967 11.7033C3.04946 11.0721 2.51073 10.2712 2.19375 9.37547" stroke={color} strokeWidth="1.5625" strokeLinecap="round"/>
    </G>
    <Defs>
      <ClipPath id="clip0_15_5045">
        <Rect width="15" height="15" fill="white"/>
      </ClipPath>
    </Defs>
  </Svg>
);

export const SendIcon = ({ size = 16, color = "black" }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

