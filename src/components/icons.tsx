import { ColorValue } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Stop, SvgProps } from "react-native-svg";


interface IconProps extends SvgProps {
    size?: number
}

export const HomeIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" color="currentColor"  {...props}>
        <Path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth={props?.strokeWidth ?? 1.5}
            d="M0.750122 10.2396V12.75C0.750122 16.0498 0.750122 17.6997 1.77525 18.7249C2.80037 19.75 4.45029 19.75 7.75012 19.75H11.7501C15.0499 19.75 16.6998 19.75 17.725 18.7249C18.7501 17.6997 18.7501 16.0498 18.7501 12.75V10.2396C18.7501 8.5583 18.7501 7.71773 18.3942 6.99005C18.0383 6.26237 17.3748 5.74628 16.0477 4.71411L14.0477 3.15855C11.9832 1.55285 10.951 0.75 9.75012 0.75C8.54922 0.75 7.51701 1.55285 5.45254 3.15855L3.45253 4.71411C2.12545 5.74628 1.46191 6.26237 1.10602 6.99005C0.750122 7.71773 0.750122 8.5583 0.750122 10.2396Z" />
        <Path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth={props?.strokeWidth ?? 1.5}
            d="M12.7503 15.25C11.9508 15.8724 10.9005 16.25 9.75026 16.25C8.59996 16.25 7.54977 15.8724 6.75024 15.25"
        />
    </Svg>
)


export const ShareIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" color="currentColor"  {...props}>
        <Path
            d="M9.39584 4.5H8.35417C5.40789 4.5 3.93475 4.5 3.01946 5.37868C2.10417 6.25736 2.10417 7.67157 2.10417 10.5V14.5C2.10417 17.3284 2.10417 18.7426 3.01946 19.6213C3.93475 20.5 5.40789 20.5 8.35417 20.5H12.5608C15.5071 20.5 16.9802 20.5 17.8955 19.6213C18.4885 19.052 18.6973 18.2579 18.7708 17"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth={props?.strokeWidth ?? 1.5}
            opacity={0.5}
        />
        <Path
            d="M16.1667 7V3.85355C16.1667 3.65829 16.3316 3.5 16.535 3.5C16.6326 3.5 16.7263 3.53725 16.7954 3.60355L21.5275 8.14645C21.7634 8.37282 21.8958 8.67986 21.8958 9C21.8958 9.32014 21.7634 9.62718 21.5275 9.85355L16.7954 14.3964C16.7263 14.4628 16.6326 14.5 16.535 14.5C16.3316 14.5 16.1667 14.3417 16.1667 14.1464V11H13.1157C8.875 11 7.3125 14.5 7.3125 14.5V12C7.3125 9.23858 9.64435 7 12.5208 7H16.1667Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth={props?.strokeWidth ?? 1.5}
        />
    </Svg>
)



export const SendIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none" color="currentColor"  {...props}>
        <Path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth={props?.strokeWidth ?? 1.5}
            d="M8.87038 6.13264L14.7327 4.19538C18.033 3.10476 19.6831 2.55945 20.5579 3.43426C21.4327 4.30907 20.8874 5.95922 19.7968 9.25953L17.8595 15.1218C16.6236 18.8619 16.0056 20.7319 14.8796 20.9603C14.6411 21.0087 14.3955 21.0129 14.1549 20.9727C13.019 20.7832 12.3132 18.9359 10.9016 15.2413C10.6328 14.5376 10.4983 14.1858 10.2574 13.9127C10.2018 13.8497 10.1424 13.7903 10.0795 13.7348C9.80638 13.4938 9.45455 13.3594 8.75089 13.0906C5.05627 11.679 3.20896 10.9732 3.01945 9.83727C2.97931 9.59669 2.98353 9.35108 3.03189 9.11259C3.26025 7.98657 5.13029 7.36859 8.87038 6.13264Z" />

        <Path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth={props?.strokeWidth ?? 1.5} d="M12.8008 11.1865L15.498 8.48926" />
    </Svg>
)


export const ChaupalIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" color="currentColor"  {...props}>
        <Path d="M13.75 4.75C13.75 6.40685 12.4069 7.75 10.75 7.75C9.0931 7.75 7.75 6.40685 7.75 4.75C7.75 3.09315 9.0931 1.75 10.75 1.75C12.4069 1.75 13.75 3.09315 13.75 4.75Z"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M14.75 0.75C16.4069 0.75 17.75 2.09315 17.75 3.75C17.75 4.97309 17.0181 6.02523 15.9683 6.4923"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12.4643 10.75H9.03572C6.66878 10.75 4.75 12.6688 4.75 15.0357C4.75 15.9825 5.51751 16.75 6.46428 16.75H15.0357C15.9825 16.75 16.75 15.9825 16.75 15.0357C16.75 12.6688 14.8312 10.75 12.4643 10.75Z"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M16.4644 9.75C18.8313 9.75 20.7501 11.6688 20.7501 14.0357C20.7501 14.9825 19.9826 15.75 19.0358 15.75"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M6.75 0.75C5.09315 0.75 3.75 2.09315 3.75 3.75C3.75 4.97309 4.48193 6.02523 5.53168 6.4923"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M2.46429 15.75C1.51751 15.75 0.75 14.9825 0.75 14.0357C0.75 11.6688 2.66878 9.75 5.03571 9.75"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
)


export const ExploreIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" color="currentColor"  {...props}>
        <Path d="M17.7504 8.89916C18.3781 8.04816 18.75 6.99041 18.75 5.84417C18.75 3.03212 16.5114 0.752502 13.75 0.752502C11.7709 0.752502 10.0604 1.92343 9.25 3.6221"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12.3864 19.0824H7.11364C4.42794 19.0824 3.08509 19.0824 2.15253 18.3715C1.88533 18.1678 1.64812 17.9262 1.44811 17.6541C0.75 16.7045 0.75 15.337 0.75 12.6021C0.75 11.0392 0.75 10.2578 1.14892 9.71519C1.26321 9.55969 1.39876 9.42159 1.55144 9.30529C2.08434 8.89899 2.85168 8.89899 4.38636 8.89899H15.1136C16.6483 8.89899 17.4157 8.89899 17.9486 9.30529C18.1012 9.42159 18.2368 9.55969 18.3511 9.71519C18.75 10.2578 18.75 11.0392 18.75 12.6021C18.75 15.337 18.75 16.7045 18.0519 17.6541C17.8519 17.9262 17.6147 18.1678 17.3475 18.3715C16.4149 19.0824 15.0721 19.0824 12.3864 19.0824Z"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M11.4358 8.89917L11.085 8.07296C10.9974 7.86655 11.0065 7.63005 11.1095 7.43645L12.6644 4.51403C12.9276 4.01929 12.5482 3.40215 12.0136 3.45559L8.8599 3.77088C8.6504 3.79182 8.442 3.70432 8.2992 3.53546L6.14732 0.991475C5.78241 0.560055 5.12203 0.741955 5.01584 1.30313L4.38969 4.6123C4.34813 4.83195 4.21021 5.01483 4.01863 5.10435L1.13401 6.45228C0.645092 6.68074 0.616692 7.41023 1.08529 7.70339L2.99666 8.89917"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
)

export const ProfileIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" color="currentColor"  {...props}>
        <Path d="M14.8677 6.63235C14.8677 3.38362 12.2341 0.75 8.98538 0.75C5.73665 0.75 3.10303 3.38362 3.10303 6.63235C3.10303 9.88106 5.73665 12.5147 8.98538 12.5147C12.2341 12.5147 14.8677 9.88106 14.8677 6.63235Z"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M17.2206 20.75C17.2206 16.2018 13.5335 12.5147 8.98529 12.5147C4.43707 12.5147 0.75 16.2018 0.75 20.75"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
)




export const CloseIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" {...props}>
        <Path d="M18 6L12 12M12 12L6 18M12 12L18 18M12 12L6 6" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);


export const CircleCloseIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" {...props}>
        <Path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M14.9994 15L9 9M9.00064 15L15 9"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export const NotificationIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none" {...props}>
        <Path d="M2.52992 14.394C2.31727 15.7471 3.268 16.6862 4.43205 17.1542C8.89481 18.9486 15.1052 18.9486 19.5679 17.1542C20.732 16.6862 21.6827 15.7471 21.4701 14.394C21.3394 13.5625 20.6932 12.8701 20.2144 12.194C19.5873 11.2975 19.525 10.3197 19.5249 9.27941C19.5249 5.2591 16.1559 2 12 2C7.84413 2 4.47513 5.2591 4.47513 9.27941C4.47503 10.3197 4.41272 11.2975 3.78561 12.194C3.30684 12.8701 2.66061 13.5625 2.52992 14.394Z" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M9 21C9.79613 21.6219 10.8475 22 12 22C13.1525 22 14.2039 21.6219 15 21" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);


export const CameraIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none"  {...props}>
        <Path d="M7.00018 6.00055C5.77954 6.00421 5.10401 6.03341 4.54891 6.2664C3.77138 6.59275 3.13819 7.19558 2.76829 7.96165C2.46636 8.58693 2.41696 9.38805 2.31814 10.9903L2.1633 13.501C1.91757 17.4854 1.7947 19.4776 2.96387 20.7388C4.13303 22 6.10271 22 10.0421 22H13.9583C17.8977 22 19.8673 22 21.0365 20.7388C22.2057 19.4776 22.0828 17.4854 21.8371 13.501L21.6822 10.9903C21.5834 9.38805 21.534 8.58693 21.2321 7.96165C20.8622 7.19558 20.229 6.59275 19.4515 6.2664C18.8964 6.03341 18.2208 6.00421 17.0002 6.00055" stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1.5"} strokeLinecap="round" />
        <Path d="M17 7L16.1142 4.78543C15.732 3.82996 15.3994 2.7461 14.4166 2.25955C13.8924 2 13.2616 2 12 2C10.7384 2 10.1076 2 9.58335 2.25955C8.6006 2.7461 8.26801 3.82996 7.88583 4.78543L7 7" stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1.5"} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M15.5 14C15.5 15.933 13.933 17.5 12 17.5C10.067 17.5 8.5 15.933 8.5 14C8.5 12.067 10.067 10.5 12 10.5C13.933 10.5 15.5 12.067 15.5 14Z" stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1.5"} />
        <Path d="M11.9998 6H12.0088" stroke="currentColor" strokeWidth={props?.strokeWidth ?? "2"} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export const LocationIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none"  {...props}>
        <Path d="M14.5 9C14.5 10.3807 13.3807 11.5 12 11.5C10.6193 11.5 9.5 10.3807 9.5 9C9.5 7.61929 10.6193 6.5 12 6.5C13.3807 6.5 14.5 7.61929 14.5 9Z" stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1.5"} />
        <Path d="M13.2574 17.4936C12.9201 17.8184 12.4693 18 12.0002 18C11.531 18 11.0802 17.8184 10.7429 17.4936C7.6543 14.5008 3.51519 11.1575 5.53371 6.30373C6.6251 3.67932 9.24494 2 12.0002 2C14.7554 2 17.3752 3.67933 18.4666 6.30373C20.4826 11.1514 16.3536 14.5111 13.2574 17.4936Z" stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1.5"} />
        <Path d="M18 20C18 21.1046 15.3137 22 12 22C8.68629 22 6 21.1046 6 20" stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1.5"} strokeLinecap="round" />
    </Svg>
);


export const SpeakerIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none"  {...props}>
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "2"} strokeLinecap="round" strokeLinejoin="round" d="M5.61646 7.70197C6.99532 7.60697 8.24589 7.57361 9.5 7.4985C13.4538 7.26169 16.7165 4.83668 19.5999 2.7838C19.8594 2.59903 20.1767 2.49991 20.5031 2.5C21.3299 2.50023 22 3.12584 22 3.8975V19.1025C22 19.8742 21.3299 20.4998 20.5031 20.5C20.1767 20.5001 19.8594 20.401 19.5999 20.2162C16.7165 18.1633 13.4538 15.7383 9.5 15.5015C8.24589 15.4264 6.99532 15.393 5.61646 15.298C3.52015 15.1536 2 13.4618 2 11.5C2 9.53816 3.52015 7.84641 5.61646 7.70197Z" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "2"} strokeLinecap="round" strokeLinejoin="round" d="M6 15.5L6.84493 20.5696C6.93441 21.1065 7.39895 21.5 7.94326 21.5C8.29374 21.5 8.62376 21.335 8.83404 21.0546L9.35777 20.3563C9.7731 19.8025 9.98415 19.1222 9.95514 18.4306L9.51757 8" />
    </Svg>
);



export const MicrophoneIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none"  {...props}>
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1.5"} strokeLinecap="round" strokeLinejoin="round" d="M17 7V11C17 13.7614 14.7614 16 12 16C9.23858 16 7 13.7614 7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7Z" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1.5"} strokeLinecap="round" strokeLinejoin="round" d="M17 7H14M17 11H14" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1.5"} strokeLinecap="round" strokeLinejoin="round" d="M20 11C20 15.4183 16.4183 19 12 19M12 19C7.58172 19 4 15.4183 4 11M12 19V22M12 22H15M12 22H9" />
    </Svg>
)

export const StorageDiskIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none"  {...props}>
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1.5"} strokeLinecap="round" strokeLinejoin="round" d="M20.7104 8.70122L21.9186 12.7288C21.9578 12.8592 21.9773 12.9244 21.9879 12.9914L21.9908 13.0118C22 13.079 22 13.147 22 13.2831C22 16.7797 22 18.528 20.9812 19.6669C20.8824 19.7774 20.7774 19.8824 20.6669 19.9812C19.528 21 17.7797 21 14.2831 21H9.71685C6.22026 21 4.47197 21 3.33311 19.9812C3.22259 19.8824 3.11765 19.7774 3.01877 19.6669C2 18.528 2 16.7797 2 13.2831C2 13.147 2 13.079 2.00915 13.0118L2.01215 12.9914C2.02269 12.9244 2.04225 12.8592 2.08136 12.7288L3.28963 8.70122C4.11355 5.95484 4.5255 4.58166 5.5884 3.79083C6.6513 3 8.08495 3 10.9522 3H13.0478C15.9151 3 17.3487 3 18.4116 3.79083C19.4745 4.58166 19.8865 5.95484 20.7104 8.70122Z" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1.5"} strokeLinecap="round" strokeLinejoin="round" d="M2 13H22" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1.5"} strokeLinecap="round" strokeLinejoin="round" d="M18.125 17H18M14.125 17H14M18.25 17C18.25 17.1381 18.1381 17.25 18 17.25C17.8619 17.25 17.75 17.1381 17.75 17C17.75 16.8619 17.8619 16.75 18 16.75C18.1381 16.75 18.25 16.8619 18.25 17ZM14.25 17C14.25 17.1381 14.1381 17.25 14 17.25C13.8619 17.25 13.75 17.1381 13.75 17C13.75 16.8619 13.8619 16.75 14 16.75C14.1381 16.75 14.25 16.8619 14.25 17Z" />
    </Svg>
)


export const StarsIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="currentColor"  {...props}>
        <Path fill="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M20 4.5L19.5 2L19 4.5L19.5 7L20 4.5Z" />
        <Path fill="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M22 4.5L19.5 4L17 4.5L19.5 5L22 4.5Z" />
        <Path fill="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M3.25 20.0833V21.4167M4.25 20.75C4.25 21.3023 3.80228 21.75 3.25 21.75C2.69772 21.75 2.25 21.3023 2.25 20.75C2.25 20.1977 2.69772 19.75 3.25 19.75C3.80228 19.75 4.25 20.1977 4.25 20.75Z" />
        <Path fill="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M12.84 7.64012L12.2249 4.97439C12.0932 4.40403 11.5854 4 11 4C10.4146 4 9.90676 4.40403 9.77514 4.97439L9.15997 7.64012C8.92946 8.63902 8.8142 9.13847 8.56753 9.54755C8.31555 9.96544 7.96544 10.3156 7.54755 10.5675C7.13847 10.8142 6.63902 10.9295 5.64012 11.16L2.97439 11.7751C2.40403 11.9068 2 12.4146 2 13C2 13.5854 2.40403 14.0932 2.97439 14.2249L5.64012 14.84C6.63902 15.0705 7.13847 15.1858 7.54755 15.4325C7.96544 15.6844 8.31555 16.0346 8.56753 16.4524C8.8142 16.8615 8.92946 17.361 9.15997 18.3599L9.77514 21.0256C9.90676 21.596 10.4146 22 11 22C11.5854 22 12.0932 21.596 12.2249 21.0256L12.84 18.3599C13.0705 17.361 13.1858 16.8615 13.4325 16.4524C13.6844 16.0346 14.0346 15.6844 14.4524 15.4325C14.8615 15.1858 15.361 15.0705 16.3599 14.84L19.0256 14.2249C19.596 14.0932 20 13.5854 20 13C20 12.4146 19.596 11.9068 19.0256 11.7751L16.3599 11.16C15.361 10.9295 14.8615 10.8142 14.4524 10.5675C14.0346 10.3156 13.6844 9.96544 13.4325 9.54755C13.1858 9.13847 13.0705 8.63902 12.84 7.64012Z" />
    </Svg>
)


export const LocationOffIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none"  {...props}>
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1.5"} strokeLinecap="round" strokeLinejoin="round" d="M17.5 17.6461C16.2676 18.9628 14.8763 20.1884 13.6177 21.367C13.1841 21.773 12.6044 22 12.0011 22C11.3978 22 10.8182 21.773 10.3845 21.367C6.41302 17.626 1.09076 13.4469 3.68627 7.37966C4.02067 6.59797 4.46666 5.63512 5 5" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1.5"} strokeLinecap="round" strokeLinejoin="round" d="M7 3.48631C8.46914 2.53477 10.213 2 12.0011 2C15.5439 2 18.9126 4.09916 20.316 7.37966C21.6603 10.5221 20.8796 13.1643 19.2612 15.5" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1.5"} strokeLinecap="round" strokeLinejoin="round" d="M9 9C8.66525 9.53668 8.5 10.3209 8.5 11C8.5 12.933 10.067 14.5 12 14.5C12.6598 14.5 13.4732 14.3174 14 14" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1.5"} strokeLinecap="round" strokeLinejoin="round" d="M11.5 7.53544C11.6633 7.51209 11.8302 7.5 12 7.5C13.933 7.5 15.5 9.067 15.5 11C15.5 11.1698 15.4879 11.3367 15.4646 11.5" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1.5"} strokeLinecap="round" strokeLinejoin="round" d="M2 2L22 22" />
    </Svg>
)
export const LocationFilledIcon = ({ size = 26, ...props }: IconProps) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 11 12"
        fill="none"
        {...props}
    >
        <Path d="M5.25 0C7.3163 0 9.28099 1.25941 10.0996 3.22754C11.6116 6.86315 8.51548 9.38331 6.19336 11.6201C5.94038 11.8637 5.60182 12 5.25 12C4.8981 12 4.55961 11.8637 4.30664 11.6201C1.99022 9.37558 -1.11345 6.86774 0.400391 3.22754C1.21901 1.25941 3.18367 5.42485e-06 5.25 0ZM5.25 3.375C4.21448 3.375 3.375 4.21447 3.375 5.25C3.375 6.28553 4.21448 7.125 5.25 7.125C6.28546 7.12493 7.125 6.28548 7.125 5.25C7.125 4.21451 6.28546 3.37507 5.25 3.375Z"
            fill="currentColor" />
    </Svg>
)


export const CurrentLocationIcon = ({ size = 24, ...props }: IconProps) => (
    <Svg width={size} height={size} viewBox={`0 0 24 24`} fill="none"  {...props}>
        <Path
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round"
            d="M12.9981 7H11.0019C8.13196 7 6.19701 10.0691 7.32753 12.828C7.48501 13.2124 7.84633 13.4615 8.24612 13.4615H8.9491C9.18605 13.4615 9.39259 13.6302 9.45006 13.8706L10.3551 17.6567C10.5438 18.4462 11.222 19 12 19C12.778 19 13.4562 18.4462 13.6449 17.6567L14.5499 13.8706C14.6074 13.6302 14.814 13.4615 15.0509 13.4615H15.7539C16.1537 13.4615 16.515 13.2124 16.6725 12.828C17.803 10.0691 15.868 7 12.9981 7Z" />
        <Path
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round"
            d="M14.5 4.5C14.5 5.88071 13.3807 7 12 7C10.6193 7 9.5 5.88071 9.5 4.5C9.5 3.11929 10.6193 2 12 2C13.3807 2 14.5 3.11929 14.5 4.5Z" />
        <Path
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round"
            d="M19 19C19 20.6569 15.866 22 12 22C8.13401 22 5 20.6569 5 19" />
    </Svg>
)


export const ArrowDownIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" color="#000"  {...props}>
        <Path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={props?.strokeWidth ?? 1.5}
            d="M18 9s-4.419 6-6 6c-1.581 0-6-6-6-6"
        />
    </Svg>
)
export const ArrowRightIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" color="#000"  {...props}>
        <Path d="M9.00005 6C9.00005 6 15 10.4189 15 12C15 13.5812 9 18 9 18" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
)

export const LinkIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none" color="#000"  {...props}>
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round"
            d="M11.1004 3.00208C7.4515 3.00864 5.54073 3.09822 4.31962 4.31931C3.00183 5.63706 3.00183 7.75796 3.00183 11.9997C3.00183 16.2415 3.00183 18.3624 4.31962 19.6801C5.6374 20.9979 7.75836 20.9979 12.0003 20.9979C16.2421 20.9979 18.3631 20.9979 19.6809 19.6801C20.902 18.4591 20.9916 16.5484 20.9982 12.8996" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round"
            d="M20.4803 3.51751L14.931 9.0515M20.4803 3.51751C19.9863 3.023 16.6587 3.0691 15.9552 3.0791M20.4803 3.51751C20.9742 4.01202 20.9282 7.34329 20.9182 8.04754" />
    </Svg>
)
export const Link2Icon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none" color="#000"  {...props}>
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" d="M9.14339 10.691L9.35031 10.4841C11.329 8.50532 14.5372 8.50532 16.5159 10.4841C18.4947 12.4628 18.4947 15.671 16.5159 17.6497L13.6497 20.5159C11.671 22.4947 8.46279 22.4947 6.48405 20.5159C4.50532 18.5372 4.50532 15.329 6.48405 13.3503L6.9484 12.886" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" d="M17.0516 11.114L17.5159 10.6497C19.4947 8.67095 19.4947 5.46279 17.5159 3.48405C15.5372 1.50532 12.329 1.50532 10.3503 3.48405L7.48405 6.35031C5.50532 8.32904 5.50532 11.5372 7.48405 13.5159C9.46279 15.4947 12.671 15.4947 14.6497 13.5159L14.8566 13.309" />
    </Svg>
)

export const ArrowRightDoubleIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none" color="#000"  {...props}>
        <Path d="M12.5 18C12.5 18 18.5 13.5811 18.5 12C18.5 10.4188 12.5 6 12.5 6" stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={props?.strokeWidth ?? 1.5} />
        <Path d="M5.50005 18C5.50005 18 11.5 13.5811 11.5 12C11.5 10.4188 5.5 6 5.5 6" stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={props?.strokeWidth ?? 1.5} />
    </Svg>
)
export const ArrowLeftIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" color="#000"  {...props}>
        <Path d="M15 6C15 6 9.00001 10.4189 9 12C8.99999 13.5812 15 18 15 18" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
)

export const EyeOpenIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none"  {...props}>
        <Path
            fill="currentColor"
            fillRule="evenodd"
            d="M5.52 6.713C7.226 5.381 9.43 4.25 12 4.25c2.57 0 4.774 1.131 6.48 2.463 1.707 1.333 2.969 2.907 3.675 3.897l.053.074c.253.352.542.754.542 1.316s-.289.964-.542 1.316l-.053.074c-.706.99-1.968 2.564-3.675 3.897-1.706 1.332-3.91 2.463-6.48 2.463-2.57 0-4.774-1.131-6.48-2.463-1.707-1.333-2.969-2.907-3.675-3.896l-.053-.075c-.253-.352-.542-.754-.542-1.316s.289-.964.542-1.316l.053-.074c.706-.99 1.968-2.564 3.675-3.897ZM8.5 12a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0Z"
            clipRule="evenodd"
        />
    </Svg>
)
export const EyeCloseIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none"  {...props}>
        <Path
            fill="currentColor"
            d="M1.445 7.168a1 1 0 0 1 1.387.277l.156.22a16.51 16.51 0 0 0 2.413 2.577c1.662 1.423 3.937 2.758 6.6 2.758 2.661 0 4.936-1.335 6.598-2.76a16.516 16.516 0 0 0 1.914-1.943 13.79 13.79 0 0 0 .655-.852 1 1 0 0 1 1.664 1.11l-.006.008c-.04.057-.143.204-.205.289-.132.178-.323.428-.572.726a18.53 18.53 0 0 1-2.148 2.181C18.062 13.335 15.338 15 12 15c-3.339 0-6.064-1.665-7.902-3.24a18.52 18.52 0 0 1-2.148-2.182c-.249-.298-.44-.548-.572-.726-.066-.09-.176-.247-.21-.297a1 1 0 0 1 .276-1.387Z"
        />
        <Path
            fill="currentColor"
            fillRule="evenodd"
            d="M4.707 10.293a1 1 0 0 1 0 1.414l-2 2a1 1 0 0 1-1.414-1.414l2-2a1 1 0 0 1 1.414 0Zm14.586 0a1 1 0 0 1 1.414 0l2 2a1 1 0 0 1-1.414 1.414l-2-2a1 1 0 0 1 0-1.414Zm-9.778 2.35a1 1 0 0 1 .342 1.371l-1.5 2.5a1 1 0 0 1-1.714-1.028l1.5-2.5a1 1 0 0 1 1.371-.344Zm4.97 0a1 1 0 0 1 1.373.342l1.5 2.5a1 1 0 0 1-1.716 1.03l-1.5-2.5a1 1 0 0 1 .344-1.373Z"
            clipRule="evenodd"
        />
    </Svg>
)

export const CalendarIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none"  {...props}>
        <Path d="M18 2V4M6 2V4" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M11.9955 13H12.0045M11.9955 17H12.0045M15.991 13H16M8 13H8.00897M8 17H8.00897" stroke="currentColor" strokeWidth={props?.strokeWidth ?? "2"} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M3.5 8H20.5" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M3 8H21" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);


export const FieldIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none"  {...props}>
        <Path opacity="0.45" d="M21.9984 8C15.6563 8 10.2992 12.217 8.57812 18" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" />
        <Path d="M21.9993 4C13.4329 4 6.26423 9.98405 4.44531 18" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" />
        <Path d="M2 10C2.87815 10 3.72986 10.1132 4.54134 10.3258" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" />
        <Path d="M2 6C3.86605 6 5.64683 6.36509 7.27481 7.02772" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" />
        <Path d="M2 2C5.17533 2 8.15863 2.82221 10.7486 4.26534" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" />
        <Path d="M21 15C21 15 17 17.5455 17 22" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M15.0827 16.455C14.1877 17.2594 12.9129 17.1733 12.0992 16.1969C10.7527 14.5811 11.022 11.0264 11.022 11.0264C11.022 11.0264 13.9842 10.7032 15.3307 12.319C15.8638 12.9587 16.0784 13.8358 15.9746 14.6667" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M18.6024 17.2609C17.7775 16.3645 17.7998 14.9686 18.6692 14.0992C20.0158 12.7527 22.978 13.022 22.978 13.022C22.978 13.022 23.2473 15.9842 21.9008 17.3307C21.4298 17.8017 20.8044 18.0241 20.1875 17.9979" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M13 14C13 14 17 16.8571 17 22" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);


export const BillIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" {...props}>
        <Path d="M1 17.6458V7.05426C1 4.20025 1 2.77325 1.87868 1.88663C2.75736 1 4.17157 1 7 1H11C13.8284 1 15.2426 1 16.1213 1.88663C17 2.77325 17 4.20025 17 7.05426V17.6458C17 19.1575 17 19.9133 16.538 20.2108C15.7831 20.6971 14.6161 19.6774 14.0291 19.3073C13.5441 19.0014 13.3017 18.8485 13.0325 18.8397C12.7417 18.8301 12.4949 18.9768 11.9709 19.3073L10.06 20.5124C9.5445 20.8374 9.2868 21 9 21C8.7132 21 8.4555 20.8374 7.94 20.5124L6.02913 19.3073C5.54415 19.0014 5.30166 18.8485 5.03253 18.8397C4.74172 18.8301 4.49493 18.9768 3.97087 19.3073C3.38395 19.6774 2.21687 20.6971 1.46195 20.2108C1 19.9133 1 19.1575 1 17.6458Z" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M10 4H4" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M7 6H4" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M14.7375 9.4C14.8825 9.4 15 9.28247 15 9.1375V8.2625C15 8.11753 14.8825 8 14.7375 8H8.2625C8.11753 8 8 8.11753 8 8.2625V9.24136C8 9.38633 8.11753 9.50386 8.2625 9.50386H10.128C10.7254 9.50386 11.1837 9.72169 11.4617 10.1H8.2625C8.11753 10.1 8 10.2175 8 10.3625V11.2375C8 11.3825 8.11753 11.5 8.2625 11.5H11.7353C11.5993 12.2894 11.0143 12.7826 10.1 12.7826H8.2625C8.11753 12.7826 8 12.9001 8 13.0451V14.2047C8 14.278 8.03063 14.3479 8.08446 14.3976L11.695 17.7304C11.7435 17.7751 11.807 17.8 11.873 17.8H13.6791C13.918 17.8 14.0327 17.5067 13.8571 17.3446L10.5566 14.2979C12.23 14.2468 13.4253 13.1299 13.5823 11.5H14.7375C14.8825 11.5 15 11.3825 15 11.2375V10.3625C15 10.2175 14.8825 10.1 14.7375 10.1H13.4537C13.3774 9.84754 13.2725 9.61337 13.1419 9.4H14.7375Z" fill="currentColor" />
    </Svg>
)


export const BookmarkIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none" {...props}>
        <Path d="M4 17.9808V9.70753C4 6.07416 4 4.25748 5.17157 3.12874C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.12874C20 4.25748 20 6.07416 20 9.70753V17.9808C20 20.2867 20 21.4396 19.2272 21.8523C17.7305 22.6514 14.9232 19.9852 13.59 19.1824C12.8168 18.7168 12.4302 18.484 12 18.484C11.5698 18.484 11.1832 18.7168 10.41 19.1824C9.0768 19.9852 6.26947 22.6514 4.77285 21.8523C4 21.4396 4 20.2867 4 17.9808Z"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round"
        />
    </Svg>
)

export const BackIcon = (props: IconProps) => (
    <Svg
        width={props.size ?? 26}
        height={props.size ?? 26}
        viewBox="0 0 16 14"
        fill="none"
        color="currentColor"
        {...props}
    >
        <Path
            d="M1.25 6.75H14.75"
            stroke="currentColor"
            strokeWidth={props?.strokeWidth ?? 1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M6.75 12.75C6.75 12.75 0.75 8.3311 0.75 6.75C0.75 5.1689 6.75 0.75 6.75 0.75"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? 1.5} strokeLinecap="round" strokeLinejoin="round"
        />
    </Svg>
);
export const ForwardIcon = (props: IconProps) => (
    <Svg
        width={props.size ?? 24}
        height={props.size ?? 24}
        viewBox="0 0 24 24"
        fill="none"
        color="currentColor"
        {...props}
    >
        <Path
            d="M18.5 12L4.99997 12"
            stroke="currentColor"
            strokeWidth={props?.strokeWidth ?? 1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M13 18C13 18 19 13.5811 19 12C19 10.4188 13 6 13 6"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? 1.5} strokeLinecap="round" strokeLinejoin="round"
        />
    </Svg>
);



export const SupportIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none" color="currentColor"  {...props}>
        <Path
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? 1.5} strokeLinecap="round" strokeLinejoin="round"
            d="M17 10.8045C17 10.4588 17 10.286 17.052 10.132C17.2032 9.68444 17.6018 9.51076 18.0011 9.32888C18.45 9.12442 18.6744 9.02219 18.8968 9.0042C19.1493 8.98378 19.4022 9.03818 19.618 9.15929C19.9041 9.31984 20.1036 9.62493 20.3079 9.87302C21.2513 11.0188 21.7229 11.5918 21.8955 12.2236C22.0348 12.7334 22.0348 13.2666 21.8955 13.7764C21.6438 14.6979 20.8485 15.4704 20.2598 16.1854C19.9587 16.5511 19.8081 16.734 19.618 16.8407C19.4022 16.9618 19.1493 17.0162 18.8968 16.9958C18.6744 16.9778 18.45 16.8756 18.0011 16.6711C17.6018 16.4892 17.2032 16.3156 17.052 15.868C17 15.714 17 15.5412 17 15.1955V10.8045Z" />
        <Path
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? 1.5} strokeLinecap="round" strokeLinejoin="round"
            d="M7 10.8046C7 10.3694 6.98778 9.97821 6.63591 9.6722C6.50793 9.5609 6.33825 9.48361 5.99891 9.32905C5.55001 9.12458 5.32556 9.02235 5.10316 9.00436C4.43591 8.9504 4.07692 9.40581 3.69213 9.87318C2.74875 11.019 2.27706 11.5919 2.10446 12.2237C1.96518 12.7336 1.96518 13.2668 2.10446 13.7766C2.3562 14.6981 3.15152 15.4705 3.74021 16.1856C4.11129 16.6363 4.46577 17.0475 5.10316 16.996C5.32556 16.978 5.55001 16.8757 5.99891 16.6713C6.33825 16.5167 6.50793 16.4394 6.63591 16.3281C6.98778 16.0221 7 15.631 7 15.1957V10.8046Z" />
        <Path
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? 1.5} strokeLinecap="round" strokeLinejoin="round"
            d="M5 9C5 5.68629 8.13401 3 12 3C15.866 3 19 5.68629 19 9" />
        <Path
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? 1.5} strokeLinecap="round" strokeLinejoin="round"
            d="M19 17V17.8C19 19.5673 17.2091 21 15 21H13" />
    </Svg>
)

export const MobileIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" color="currentColor"  {...props}>
        <Path
            d="M4.91186 10.5413L7.55229 7.90088C8.09091 7.36227 8.27728 6.56642 8.05944 5.83652C7.8891 5.26577 7.69718 4.57964 7.56961 3.99292C7.45162 3.45027 6.97545 3 6.42012 3H4.91186C3.8012 3 2.88911 3.90384 3.01094 5.0078C3.93709 13.3996 10.6004 20.0629 18.9922 20.9891C20.0962 21.1109 21 20.1988 21 19.0881V17.5799C21 17.0246 20.5479 16.569 20.0015 16.4696C19.3988 16.36 18.7611 16.1804 18.2276 16.0103C17.4611 15.7659 16.6091 15.9377 16.0403 16.5065L13.4587 19.0881"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round"
        />
    </Svg>
)

export const EmailIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none" color="currentColor"  {...props}>
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1.5"} strokeLinecap="round" strokeLinejoin="round"
            d="M7 7.5L9.94202 9.23943C11.6572 10.2535 12.3428 10.2535 14.058 9.23943L17 7.5" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1.5"} strokeLinecap="round" strokeLinejoin="round"
            d="M10.5 19.5C10.0337 19.4939 9.56682 19.485 9.09883 19.4732C5.95033 19.3941 4.37608 19.3545 3.24496 18.2184C2.11383 17.0823 2.08114 15.5487 2.01577 12.4814C1.99475 11.4951 1.99474 10.5147 2.01576 9.52843C2.08114 6.46113 2.11382 4.92748 3.24495 3.79139C4.37608 2.6553 5.95033 2.61573 9.09882 2.53658C11.0393 2.4878 12.9607 2.48781 14.9012 2.53659C18.0497 2.61574 19.6239 2.65532 20.755 3.79141C21.8862 4.92749 21.9189 6.46114 21.9842 9.52844C21.9939 9.98251 21.9991 10.1965 21.9999 10.5" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1.5"} strokeLinecap="round" strokeLinejoin="round"
            d="M19 17C19 17.8284 18.3284 18.5 17.5 18.5C16.6716 18.5 16 17.8284 16 17C16 16.1716 16.6716 15.5 17.5 15.5C18.3284 15.5 19 16.1716 19 17ZM19 17V17.5C19 18.3284 19.6716 19 20.5 19C21.3284 19 22 18.3284 22 17.5V17C22 14.5147 19.9853 12.5 17.5 12.5C15.0147 12.5 13 14.5147 13 17C13 19.4853 15.0147 21.5 17.5 21.5" />
    </Svg>
)

export const WalletSolidIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" color="currentColor"  {...props}>
        <Path d="M3 8.5H15C17.8284 8.5 19.2426 8.5 20.1213 9.37868C21 10.2574 21 11.6716 21 14.5V15.5C21 18.3284 21 19.7426 20.1213 20.6213C19.2426 21.5 17.8284 21.5 15 21.5H9C6.17157 21.5 4.75736 21.5 3.87868 20.6213C3 19.7426 3 18.3284 3 15.5V8.5Z"
            strokeLinecap="round" strokeLinejoin="round" fill={'#be9524ff'} />
        <Path d="M15 8.49833V4.1103C15 3.22096 14.279 2.5 13.3897 2.5C13.1336 2.5 12.8812 2.56108 12.6534 2.67818L3.7623 7.24927C3.29424 7.48991 3 7.97203 3 8.49833"
            strokeLinecap="round" strokeLinejoin="round" fill={'#774400ff'} />
        <Path d="M17.5 15.5C17.7761 15.5 18 15.2761 18 15C18 14.7239 17.7761 14.5 17.5 14.5M17.5 15.5C17.2239 15.5 17 15.2761 17 15C17 14.7239 17.2239 14.5 17.5 14.5M17.5 15.5V14.5"
            strokeLinecap="round" strokeLinejoin="round" fill={'#000000ff'} />

    </Svg>
)

export const PasswordIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" color="currentColor"  {...props}>
        <Path d="M18.7088 3.49534C16.8165 2.55382 14.5009 2 12 2C9.4991 2 7.1835 2.55382 5.29116 3.49534C4.36318 3.95706 3.89919 4.18792 3.4496 4.91378C3 5.63965 3 6.34248 3 7.74814V11.2371C3 16.9205 7.54236 20.0804 10.173 21.4338C10.9067 21.8113 11.2735 22 12 22C12.7265 22 13.0933 21.8113 13.8269 21.4338C16.4576 20.0804 21 16.9205 21 11.2371L21 7.74814C21 6.34249 21 5.63966 20.5504 4.91378C20.1008 4.18791 19.6368 3.95706 18.7088 3.49534Z" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12.125 11H12M12.25 11C12.25 11.1381 12.1381 11.25 12 11.25C11.8619 11.25 11.75 11.1381 11.75 11C11.75 10.8619 11.8619 10.75 12 10.75C12.1381 10.75 12.25 10.8619 12.25 11Z" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M16.125 11H16M16.25 11C16.25 11.1381 16.1381 11.25 16 11.25C15.8619 11.25 15.75 11.1381 15.75 11C15.75 10.8619 15.8619 10.75 16 10.75C16.1381 10.75 16.25 10.8619 16.25 11Z" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M8.125 11H8M8.25 11C8.25 11.1381 8.13807 11.25 8 11.25C7.86193 11.25 7.75 11.1381 7.75 11C7.75 10.8619 7.86193 10.75 8 10.75C8.13807 10.75 8.25 10.8619 8.25 11Z" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
)


export const Field2Icon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" color="currentColor"  {...props}>
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round"
            d="M11.1545 6.05147C11.4024 6.49867 11.5263 6.72226 11.5263 6.96779C11.5263 7.21332 11.4024 7.43691 11.1545 7.88411L9.97077 10.0193C9.72287 10.4665 9.5989 10.6901 9.39474 10.8128C9.19057 10.9356 8.94265 10.9356 8.44683 10.9356H6.07949C5.58366 10.9356 5.33575 10.9356 5.13158 10.8128C4.92741 10.6901 4.80345 10.4665 4.55554 10.0193L3.37187 7.88411C3.12395 7.43691 3 7.21332 3 6.96779C3 6.72226 3.12395 6.49867 3.37187 6.05147L4.55554 3.91632C4.80345 3.46912 4.92741 3.24553 5.13158 3.12276C5.33575 3 5.58366 3 6.07949 3H8.44683C8.94265 3 9.19057 3 9.39474 3.12276C9.5989 3.24553 9.72287 3.46912 9.97077 3.91632L11.1545 6.05147Z" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round"
            d="M20.6281 12.0031C20.876 12.4504 20.9999 12.6739 20.9999 12.9195C20.9999 13.165 20.876 13.3885 20.6281 13.8358L19.4444 15.9709C19.1965 16.4181 19.0725 16.6417 18.8684 16.7644C18.6642 16.8872 18.4163 16.8872 17.9204 16.8872H15.5531C15.0573 16.8872 14.8094 16.8872 14.6052 16.7644C14.4011 16.6417 14.277 16.4181 14.0292 15.9709L12.8455 13.8358C12.5975 13.3885 12.4736 13.165 12.4736 12.9195C12.4736 12.6739 12.5975 12.4504 12.8455 12.0031L14.0292 9.86798C14.277 9.42078 14.4011 9.19719 14.6052 9.07442C14.8094 8.95166 15.0573 8.95166 15.5531 8.95166H17.9204C18.4163 8.95166 18.6642 8.95166 18.8684 9.07442C19.0725 9.19719 19.1965 9.42078 19.4444 9.86798L20.6281 12.0031Z" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round"
            d="M11.1545 16.9628C11.4024 17.4101 11.5263 17.6337 11.5263 17.8792C11.5263 18.1247 11.4024 18.3483 11.1545 18.7955L9.97077 20.9306C9.72287 21.3779 9.5989 21.6015 9.39474 21.7242C9.19057 21.847 8.94265 21.847 8.44683 21.847H6.07949C5.58366 21.847 5.33575 21.847 5.13158 21.7242C4.92741 21.6015 4.80345 21.3779 4.55554 20.9306L3.37187 18.7955C3.12395 18.3483 3 18.1247 3 17.8792C3 17.6337 3.12395 17.4101 3.37187 16.9628L4.55554 14.8277C4.80345 14.3805 4.92741 14.1569 5.13158 14.0342C5.33575 13.9114 5.58366 13.9114 6.07949 13.9114H8.44683C8.94265 13.9114 9.19057 13.9114 9.39474 14.0342C9.5989 14.1569 9.72287 14.3805 9.97077 14.8277L11.1545 16.9628Z" />
    </Svg>
)



export const QrIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none"  {...props}>
        <Path d="M3 6C3 4.58579 3 3.87868 3.43934 3.43934C3.87868 3 4.58579 3 6 3C7.41421 3 8.12132 3 8.56066 3.43934C9 3.87868 9 4.58579 9 6C9 7.41421 9 8.12132 8.56066 8.56066C8.12132 9 7.41421 9 6 9C4.58579 9 3.87868 9 3.43934 8.56066C3 8.12132 3 7.41421 3 6Z" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} />
        <Path d="M3 18C3 16.5858 3 15.8787 3.43934 15.4393C3.87868 15 4.58579 15 6 15C7.41421 15 8.12132 15 8.56066 15.4393C9 15.8787 9 16.5858 9 18C9 19.4142 9 20.1213 8.56066 20.5607C8.12132 21 7.41421 21 6 21C4.58579 21 3.87868 21 3.43934 20.5607C3 20.1213 3 19.4142 3 18Z" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} />
        <Path d="M3 12L9 12" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 3V8" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M15 6C15 4.58579 15 3.87868 15.4393 3.43934C15.8787 3 16.5858 3 18 3C19.4142 3 20.1213 3 20.5607 3.43934C21 3.87868 21 4.58579 21 6C21 7.41421 21 8.12132 20.5607 8.56066C20.1213 9 19.4142 9 18 9C16.5858 9 15.8787 9 15.4393 8.56066C15 8.12132 15 7.41421 15 6Z" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} />
        <Path d="M21 12H15C13.5858 12 12.8787 12 12.4393 12.4393C12 12.8787 12 13.5858 12 15M12 17.7692V20.5385M15 15V16.5C15 17.9464 15.7837 18 17 18C17.5523 18 18 18.4477 18 19M16 21H15M18 15C19.4142 15 20.1213 15 20.5607 15.44C21 15.8799 21 16.5881 21 18.0043C21 19.4206 21 20.1287 20.5607 20.5687C20.24 20.8898 19.7767 20.9766 19 21" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" />
    </Svg>
);

export const ArrowUpRightIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" color="currentColor"  {...props}>
        <Path d="M9 6.65032C9 6.65032 15.9383 6.10759 16.9154 7.08463C17.8924 8.06167 17.3496 15 17.3496 15M16.5 7.5L6.5 17.5"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
)
export const ArrowDownRightIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" color="currentColor"  {...props}>
        <Path
            d="M9 17.3497C9 17.3497 15.9383 17.8924 16.9154 16.9154C17.8924 15.9383 17.3496 9 17.3496 9M16.5 16.5L6.5 6.5"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
)


export const DoneIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none"  {...props}>
        <Path
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round"
            d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 11.3151 21.9311 10.6462 21.8 10" />
        <Path
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round"
            d="M8 12.5C8 12.5 9.5 12.5 11.5 16C11.5 16 17.0588 6.83333 22 5" />
    </Svg>
);


export const ClockIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none" color="currentColor"  {...props}>
        <Circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 8V12L14 14" strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} />
    </Svg>
)


export const MessageIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none" color="currentColor"  {...props}>
        <Path opacity={0.35} strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} d="M7.79098 19C7.46464 18.8681 7.28441 18.8042 7.18359 18.8166C7.05968 18.8317 6.8799 18.9637 6.52034 19.2275C5.88637 19.6928 5.0877 20.027 3.90328 19.9983C3.30437 19.9838 3.00491 19.9765 2.87085 19.749C2.73679 19.5216 2.90376 19.2067 3.23769 18.5769C3.70083 17.7034 3.99427 16.7035 3.54963 15.9023C2.78384 14.7578 2.13336 13.4025 2.0383 11.9387C1.98723 11.1522 1.98723 10.3377 2.0383 9.55121C2.29929 5.53215 5.47105 2.33076 9.45292 2.06733C10.8086 1.97765 12.2269 1.97746 13.5854 2.06733C17.5503 2.32964 20.712 5.50498 20.9965 9.5" />
        <Path strokeLinecap="round" strokeLinejoin="round" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} d="M14.6976 21.6471C12.1878 21.4862 10.1886 19.5298 10.0241 17.0737C9.99195 16.593 9.99195 16.0953 10.0241 15.6146C10.1886 13.1585 12.1878 11.2021 14.6976 11.0411C15.5539 10.9862 16.4479 10.9863 17.3024 11.0411C19.8122 11.2021 21.8114 13.1585 21.9759 15.6146C22.008 16.0953 22.008 16.593 21.9759 17.0737C21.9159 17.9682 21.5059 18.7965 21.0233 19.4958C20.743 19.9854 20.928 20.5965 21.2199 21.1303C21.4304 21.5152 21.5356 21.7076 21.4511 21.8466C21.3666 21.9857 21.1778 21.9901 20.8003 21.999C20.0538 22.0165 19.5504 21.8123 19.1508 21.5279C18.9242 21.3667 18.8108 21.2861 18.7327 21.2768C18.6546 21.2675 18.5009 21.3286 18.1936 21.4507C17.9174 21.5605 17.5966 21.6283 17.3024 21.6471C16.4479 21.702 15.5539 21.7021 14.6976 21.6471Z" />
    </Svg>
)


export const LeafIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none" color="currentColor"  {...props}>
        <Path d="M7.64584 15.7108C7.23279 14.8966 7 13.9755 7 13C7 9.78484 9.5 7.5 13 7C17.0817 6.4169 18.8333 4.16667 20 3C23.5 16 17 19 13 19C11.9071 19 10.8825 18.7078 10 18.1973"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M3 21C3.5 18 5.45791 16.1355 10 15C13.2167 14.1958 15.4634 12.1791 17 10.0549"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
)

export const VerifyIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none" color="currentColor"  {...props}>
        <Path d="M9 12.6667C9 12.6667 9.625 12.6667 10.25 14C10.25 14 12.2352 10.6667 14 10"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M21 11.6425V8.59433C21 6.8723 21 6.0113 20.5734 5.44955C20.1469 4.8878 19.1825 4.61509 17.2535 4.06965C15.9356 3.69701 14.7739 3.24806 13.8458 2.8382C12.5802 2.27941 11.9476 2 11.5 2C11.0524 2 10.4198 2.27941 9.15423 2.8382C8.22606 3.24806 7.06438 3.697 5.74652 4.06965C3.81759 4.61509 2.85312 4.8878 2.42656 5.44955C2 6.0113 2 6.8723 2 8.59433V11.6425C2 17.5489 7.34403 21.0927 10.0159 22.4953C10.6567 22.8318 10.9771 23 11.5 23C12.0229 23 12.3433 22.8318 12.9841 22.4953C15.6559 21.0927 21 17.5489 21 11.6425Z"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
)

export const AiReportIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none" color="currentColor"  {...props}>
        <Path d="M11.5 6C7.02166 6 4.78249 6 3.39124 7.17157C2 8.34315 2 10.2288 2 14C2 17.7712 2 19.6569 3.39124 20.8284C4.78249 22 7.02166 22 11.5 22C15.9783 22 18.2175 22 19.6088 20.8284C21 19.6569 21 17.7712 21 14C21 12.8302 21 11.8419 20.9585 11" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M18.5 2L18.7579 2.69703C19.0961 3.61102 19.2652 4.06802 19.5986 4.40139C19.932 4.73477 20.389 4.90387 21.303 5.24208L22 5.5L21.303 5.75792C20.389 6.09613 19.932 6.26524 19.5986 6.59861C19.2652 6.93198 19.0961 7.38898 18.7579 8.30297L18.5 9L18.2421 8.30297C17.9039 7.38898 17.7348 6.93198 17.4014 6.59861C17.068 6.26524 16.611 6.09613 15.697 5.75792L15 5.5L15.697 5.24208C16.611 4.90387 17.068 4.73477 17.4014 4.40139C17.7348 4.06802 17.9039 3.61102 18.2421 2.69703L18.5 2Z" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 10V18" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
        <Path d="M9 12V16" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M6 13V15" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
        <Path d="M15 12V16" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M18 13V15" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
    </Svg>
)

type AiReportGradientIconProps = IconProps & {
    color1?: ColorValue;
    color2?: ColorValue;
    color3?: ColorValue;
};

export const AiReportGradientIcon = ({
    color1 = "#8B5CF6",
    color2 = "#3B82F6",
    color3 = "#06B6D4",
    ...props
}: AiReportGradientIconProps) => (
    <Svg
        width={props.size ?? 24}
        height={props.size ?? 24}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <Defs>
            <LinearGradient
                id="aiReportGradient"
                x1="2"
                y1="2"
                x2="22"
                y2="22"
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset="0%" stopColor={color1} />
                <Stop offset="50%" stopColor={color2} />
                <Stop offset="100%" stopColor={color3} />
            </LinearGradient>
        </Defs>

        <Path
            d="M11.5 6C7.02166 6 4.78249 6 3.39124 7.17157C2 8.34315 2 10.2288 2 14C2 17.7712 2 19.6569 3.39124 20.8284C4.78249 22 7.02166 22 11.5 22C15.9783 22 18.2175 22 19.6088 20.8284C21 19.6569 21 17.7712 21 14C21 12.8302 21 11.8419 20.9585 11"
            stroke="url(#aiReportGradient)"
            strokeWidth={props?.strokeWidth ?? 1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />

        <Path
            d="M18.5 2L18.7579 2.69703C19.0961 3.61102 19.2652 4.06802 19.5986 4.40139C19.932 4.73477 20.389 4.90387 21.303 5.24208L22 5.5L21.303 5.75792C20.389 6.09613 19.932 6.26524 19.5986 6.59861C19.2652 6.93198 19.0961 7.38898 18.7579 8.30297L18.5 9L18.2421 8.30297C17.9039 7.38898 17.7348 6.93198 17.4014 6.59861C17.068 6.26524 16.611 6.09613 15.697 5.75792L15 5.5L15.697 5.24208C16.611 4.90387 17.068 4.73477 17.4014 4.40139C17.7348 4.06802 17.9039 3.61102 18.2421 2.69703L18.5 2Z"
            fill="url(#aiReportGradient)"
            strokeLinecap="round"
            strokeLinejoin="round"
        />

        <Path
            d="M12 10V18"
            stroke="url(#aiReportGradient)"
            strokeWidth={props?.strokeWidth ?? 1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.6}
        />

        <Path
            d="M9 12V16"
            stroke="url(#aiReportGradient)"
            strokeWidth={props?.strokeWidth ?? 1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />

        <Path
            d="M6 13V15"
            stroke="url(#aiReportGradient)"
            strokeWidth={props?.strokeWidth ?? 1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.6}
        />

        <Path
            d="M15 12V16"
            stroke="url(#aiReportGradient)"
            strokeWidth={props?.strokeWidth ?? 1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />

        <Path
            d="M18 13V15"
            stroke="url(#aiReportGradient)"
            strokeWidth={props?.strokeWidth ?? 1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={0.6}
        />
    </Svg>
);

export const PlusIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none" color="currentColor"  {...props}>
        <Path d="M12 8V16M16 12H8" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
)

export const Plus2Icon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none" color="currentColor"  {...props}>
        <Path d="M12 8V16M16 12H8" stroke="currentColor" strokeWidth={props.strokeWidth ?? "1.5"} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
)


export const MinusIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none" color="currentColor"  {...props}>
        <Path d="M16 12H8" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
)

export const LikeIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none"  {...props}>
        <Path
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round"
            d="M2 12.5C2 11.3954 2.89543 10.5 4 10.5C5.65685 10.5 7 11.8431 7 13.5V17.5C7 19.1569 5.65685 20.5 4 20.5C2.89543 20.5 2 19.6046 2 18.5V12.5Z"
        />
        <Path d="M15.4787 7.80626L15.2124 8.66634C14.9942 9.37111 14.8851 9.72349 14.969 10.0018C15.0369 10.2269 15.1859 10.421 15.389 10.5487C15.64 10.7065 16.0197 10.7065 16.7791 10.7065H17.1831C19.7532 10.7065 21.0382 10.7065 21.6452 11.4673C21.7145 11.5542 21.7762 11.6467 21.8296 11.7437C22.2965 12.5921 21.7657 13.7351 20.704 16.0211C19.7297 18.1189 19.2425 19.1678 18.338 19.7852C18.2505 19.8449 18.1605 19.9013 18.0683 19.9541C17.116 20.5 15.9362 20.5 13.5764 20.5H13.0646C10.2057 20.5 8.77628 20.5 7.88814 19.6395C7 18.7789 7 17.3939 7 14.6239V13.6503C7 12.1946 7 11.4668 7.25834 10.8006C7.51668 10.1344 8.01135 9.58664 9.00069 8.49112L13.0921 3.96056C13.1947 3.84694 13.246 3.79012 13.2913 3.75075C13.7135 3.38328 14.3652 3.42464 14.7344 3.84235C14.774 3.8871 14.8172 3.94991 14.9036 4.07554C15.0388 4.27205 15.1064 4.37031 15.1654 4.46765C15.6928 5.33913 15.8524 6.37436 15.6108 7.35715C15.5838 7.46692 15.5488 7.5801 15.4787 7.80626Z"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round"
        />
    </Svg>
)

export const WarningIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none"  {...props}>
        <Path d="M5.32171 9.6829C7.73539 5.41196 8.94222 3.27648 10.5983 2.72678C11.5093 2.42437 12.4907 2.42437 13.4017 2.72678C15.0578 3.27648 16.2646 5.41196 18.6783 9.6829C21.092 13.9538 22.2988 16.0893 21.9368 17.8293C21.7376 18.7866 21.2469 19.6548 20.535 20.3097C19.241 21.5 16.8274 21.5 12 21.5C7.17265 21.5 4.75897 21.5 3.46496 20.3097C2.75308 19.6548 2.26239 18.7866 2.06322 17.8293C1.70119 16.0893 2.90803 13.9538 5.32171 9.6829Z" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} />
        <Path d="M11.992 16H12.001" stroke="currentColor" strokeWidth={props?.strokeWidth ?? "2"} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 13L12 8.99997" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export const InfoIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none"  {...props}>
        <Path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} />
        <Path d="M12.2422 17V12C12.2422 11.5286 12.2422 11.2929 12.0957 11.1464C11.9493 11 11.7136 11 11.2422 11" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M11.992 8H12.001" stroke="currentColor" strokeWidth={props?.strokeWidth ?? "2"} strokeLinecap="round" strokeLinejoin="round" />
    </Svg >
);

export const ChemicalIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none"  {...props}>
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1"} strokeLinecap="round" strokeLinejoin="round" d="M13.5 18C13.5 20.2091 11.7091 22 9.5 22C7.29086 22 5.5 20.2091 5.5 18V2H13.5V10" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1"} strokeLinecap="round" strokeLinejoin="round" d="M16 10.5L15.7421 11.197C15.4039 12.111 15.2348 12.568 14.9014 12.9014C14.568 13.2348 14.111 13.4039 13.197 13.7421L12.5 14L13.197 14.2579C14.111 14.5961 14.568 14.7652 14.9014 15.0986C15.2348 15.432 15.4039 15.889 15.7421 16.803L16 17.5L16.2579 16.803C16.5961 15.889 16.7652 15.432 17.0986 15.0986C17.432 14.7652 17.889 14.5961 18.803 14.2579L19.5 14L18.803 13.7421C17.889 13.4039 17.432 13.2348 17.0986 12.9014C16.7652 12.568 16.5961 12.111 16.2579 11.197L16 10.5Z" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1"} strokeLinecap="round" strokeLinejoin="round" d="M4.5 2H14.5" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "1"} strokeLinecap="round" strokeLinejoin="round" d="M5.5 8H13.5" />
    </Svg >
);



export const AddMediaIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none"  {...props}>
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "2"} strokeLinecap="round" strokeLinejoin="round" d="M21.5 18.5H18.5M18.5 18.5H15.5M18.5 18.5V15.5M18.5 18.5V21.5" stroke-linejoin="round" />
        <Circle stroke="currentColor" strokeWidth={props?.strokeWidth ?? "2"} strokeLinecap="round" strokeLinejoin="round" cx="7.5" cy="7.5" r="1.5" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "2"} strokeLinecap="round" strokeLinejoin="round" d="M11.5 21.5C7.35301 21.4981 5.22972 21.4473 3.89124 20.1088C2.5 18.7176 2.5 16.4784 2.5 12C2.5 7.52168 2.5 5.2825 3.89124 3.89125C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89125C21.5 5.2825 21.5 7.52168 21.5 12" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "2"} strokeLinecap="round" strokeLinejoin="round" d="M13.0018 13.0616C10.1493 14.6467 7.70477 17.7414 5.41797 20.5" />
    </Svg>
)


export const EditIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none"  {...props}>
        <Path d="M15.2141 5.98239L16.6158 4.58063C17.39 3.80646 18.6452 3.80646 19.4194 4.58063C20.1935 5.3548 20.1935 6.60998 19.4194 7.38415L18.0176 8.78591M15.2141 5.98239L6.98023 14.2163C5.93493 15.2616 5.41226 15.7842 5.05637 16.4211C4.70047 17.058 4.3424 18.5619 4 20C5.43809 19.6576 6.94199 19.2995 7.57889 18.9436C8.21579 18.5877 8.73844 18.0651 9.78375 17.0198L18.0176 8.78591M15.2141 5.98239L18.0176 8.78591"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? "2"} strokeLinecap="round" strokeLinejoin="round"
        />
        <Path d="M11 20H17" stroke="currentColor" strokeWidth={props?.strokeWidth ?? "2"} strokeLinecap="round" strokeLinejoin="round" />
    </Svg >
);

export const SearchIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none"  {...props}>
        <Path d="M17.5 17.5L22 22" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinejoin="round" />
    </Svg>
);


export const UserMultipleIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" {...props}>
        <Path d="M16.5 20V17.9704C16.5 16.7281 15.9407 15.5099 14.8103 14.9946C13.4315 14.3661 11.7779 14 10 14C8.22212 14 6.5685 14.3661 5.18968 14.9946C4.05927 15.5099 3.5 16.7281 3.5 17.9704V20" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M20.5 20.001V17.9713C20.5 16.729 19.9407 15.5109 18.8103 14.9956C18.5497 14.8768 18.2792 14.7673 18 14.668" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Circle cx="10" cy="7.5" r="3.5" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M15 4.14453C16.4457 4.57481 17.5 5.91408 17.5 7.49959C17.5 9.0851 16.4457 10.4244 15 10.8547" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);


export const ImageIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none"  {...props}>
        <Circle cx="7.5" cy="7.5" r="1.5" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} />
        <Path d="M5 21C9.37246 15.775 14.2741 8.88406 21.4975 13.5424" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} />
    </Svg>
);
export const GallaryIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none"  {...props}>
        <Path d="M13 3.00231C12.5299 3 12.0307 3 11.5 3C7.02166 3 4.78249 3 3.39124 4.39124C2 5.78249 2 8.02166 2 12.5C2 16.9783 2 19.2175 3.39124 20.6088C4.78249 22 7.02166 22 11.5 22C15.9783 22 18.2175 22 19.6088 20.6088C20.9472 19.2703 20.998 17.147 20.9999 13" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" />
        <Path d="M2 14.1354C2.61902 14.0455 3.24484 14.0011 3.87171 14.0027C6.52365 13.9466 9.11064 14.7729 11.1711 16.3342C13.082 17.7821 14.4247 19.7749 15 22" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinejoin="round" />
        <Path d="M21 16.8962C19.8246 16.3009 18.6088 15.9988 17.3862 16.0001C15.5345 15.9928 13.7015 16.6733 12 18" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinejoin="round" />
        <Path d="M17 4.5C17.4915 3.9943 18.7998 2 19.5 2M22 4.5C21.5085 3.9943 20.2002 2 19.5 2M19.5 2V10" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);
export const BinIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" {...props}>
        <Path opacity="0.4" d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5H19.5Z" fill="currentColor" />
        <Path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" />
        <Path d="M21 5.5H3" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" />
        <Path d="M16.0575 5.5L15.3748 4.09173C14.9213 3.15626 14.6946 2.68852 14.3035 2.39681C14.2167 2.3321 14.1249 2.27454 14.0288 2.2247C13.5957 2 13.0759 2 12.0363 2C10.9706 2 10.4377 2 9.99745 2.23412C9.89986 2.28601 9.80675 2.3459 9.71906 2.41317C9.3234 2.7167 9.10239 3.20155 8.66037 4.17126L8.05469 5.5" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" />
    </Svg>
)

export const FocusIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none"  {...props}>
        <Path d="M9.13437 2.5C6.46809 2.56075 4.91075 2.81456 3.84669 3.87493C2.91541 4.80297 2.60411 6.10756 2.50005 8.2M14.8657 2.5C17.532 2.56075 19.0893 2.81456 20.1534 3.87493C21.0847 4.80297 21.396 6.10756 21.5 8.2M14.8657 21.5C17.532 21.4392 19.0893 21.1854 20.1534 20.1251C21.0847 19.197 21.396 17.8924 21.5 15.8M9.13437 21.5C6.46809 21.4392 4.91075 21.1854 3.84669 20.1251C2.91541 19.197 2.60411 17.8924 2.50005 15.8" stroke="currentColor" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);



export const DroneIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" {...props}>
        <Path opacity="0.4" d="M12 7C6.47715 7 2 7.89543 2 9C2 9.80571 4.38215 10.5001 7.81468 10.8169C8.43288 10.874 8.85702 11.4721 8.92296 12.0894C9.09436 13.6942 10.384 15 12 15C13.616 15 14.9056 13.6942 15.077 12.0894C15.143 11.4721 15.5671 10.874 16.1853 10.8169C19.6179 10.5001 22 9.80571 22 9C22 7.89543 17.5228 7 12 7Z" fill="currentColor" />
        <Path d="M12 7C6.47715 7 2 7.89543 2 9C2 9.80571 4.38215 10.5001 7.81468 10.8169C8.43288 10.874 8.85702 11.4721 8.92296 12.0894C9.09436 13.6942 10.384 15 12 15C13.616 15 14.9056 13.6942 15.077 12.0894C15.143 11.4721 15.5671 10.874 16.1853 10.8169C19.6179 10.5001 22 9.80571 22 9C22 7.89543 17.5228 7 12 7Z" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinejoin="round" />
        <Path d="M11.9998 12H12.0088" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M4 3H6M8 3H6M6 3V7" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M16 3H18M20 3H18M18 3V7" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M5 21V19.5C5 16.7386 7.23858 14.5 10 14.5M19 21V19.5C19 16.7386 16.7614 14.5 14 14.5" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
)


export const GearIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" color="#000"  {...props}>
        <Path
            stroke="currentColor"
            strokeWidth={props?.strokeWidth ?? 1.5}
            d="M15.5 12a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
        />
        <Path
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth={props?.strokeWidth ?? 1.5}
            d="M21.011 14.097c.522-.141.783-.212.886-.346.103-.135.103-.351.103-.784v-1.934c0-.433 0-.65-.103-.784s-.364-.205-.886-.345c-1.95-.526-3.171-2.565-2.668-4.503.139-.533.208-.8.142-.956-.066-.156-.256-.264-.635-.479l-1.725-.98c-.372-.21-.558-.316-.725-.294-.167.023-.356.21-.733.587-1.459 1.455-3.873 1.455-5.333 0-.377-.376-.565-.564-.732-.587-.167-.022-.353.083-.725.295l-1.725.979c-.38.215-.57.323-.635.48-.066.155.003.422.141.955.503 1.938-.718 3.977-2.669 4.503-.522.14-.783.21-.886.345C2 10.384 2 10.6 2 11.033v1.934c0 .433 0 .65.103.784s.364.205.886.346c1.95.526 3.171 2.565 2.668 4.502-.139.533-.208.8-.142.956.066.156.256.264.635.48l1.725.978c.372.212.558.317.725.295.167-.023.356-.21.733-.587 1.46-1.457 3.876-1.457 5.336 0 .377.376.565.564.732.587.167.022.353-.083.726-.295l1.724-.979c.38-.215.57-.323.635-.48.066-.156-.003-.422-.141-.955-.504-1.937.716-3.976 2.666-4.502Z"
        />
    </Svg>
)

export const AlertIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" {...props}>
        <Path d="M5.32171 9.6829C7.73539 5.41196 8.94222 3.27648 10.5983 2.72678C11.5093 2.42437 12.4907 2.42437 13.4017 2.72678C15.0578 3.27648 16.2646 5.41196 18.6783 9.6829C21.092 13.9538 22.2988 16.0893 21.9368 17.8293C21.7376 18.7866 21.2469 19.6548 20.535 20.3097C19.241 21.5 16.8274 21.5 12 21.5C7.17265 21.5 4.75897 21.5 3.46496 20.3097C2.75308 19.6548 2.26239 18.7866 2.06322 17.8293C1.70119 16.0893 2.90803 13.9538 5.32171 9.6829Z" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} />
        <Path d="M11.992 16H12.001" stroke="currentColor" strokeWidth={props?.strokeWidth ?? "2"} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 13L12 8.99997" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);


export const CheckmarkCircleIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" {...props}>
        <Path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} />
        <Path d="M8 12.75C8 12.75 9.6 13.6625 10.4 15C10.4 15 12.8 9.75 16 8" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);


export const LoadingJarIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" {...props}>
        <Path d="M17.2014 2H6.79876C5.341 2 4.06202 2.9847 4.0036 4.40355C3.93009 6.18879 5.18564 7.37422 6.50435 8.4871C8.32861 10.0266 9.24075 10.7964 9.33642 11.7708C9.35139 11.9233 9.35139 12.0767 9.33642 12.2292C9.24075 13.2036 8.32862 13.9734 6.50435 15.5129C5.14932 16.6564 3.9263 17.7195 4.0036 19.5964C4.06202 21.0153 5.341 22 6.79876 22L17.2014 22C18.6591 22 19.9381 21.0153 19.9965 19.5964C20.043 18.4668 19.6244 17.342 18.7352 16.56C18.3298 16.2034 17.9089 15.8615 17.4958 15.5129C15.6715 13.9734 14.7594 13.2036 14.6637 12.2292C14.6487 12.0767 14.6487 11.9233 14.6637 11.7708C14.7594 10.7964 15.6715 10.0266 17.4958 8.4871C18.8366 7.35558 20.0729 6.25809 19.9965 4.40355C19.9381 2.9847 18.6591 2 17.2014 2Z" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} />
        <Path d="M9 21.6381C9 21.1962 9 20.9752 9.0876 20.7821C9.10151 20.7514 9.11699 20.7214 9.13399 20.6923C9.24101 20.509 9.42211 20.3796 9.78432 20.1208C10.7905 19.4021 11.2935 19.0427 11.8652 19.0045C11.955 18.9985 12.045 18.9985 12.1348 19.0045C12.7065 19.0427 13.2095 19.4021 14.2157 20.1208C14.5779 20.3796 14.759 20.509 14.866 20.6923C14.883 20.7214 14.8985 20.7514 14.9124 20.7821C15 20.9752 15 21.1962 15 21.6381V22H9V21.6381Z" stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" />
    </Svg>
);

export const PlayIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none" {...props}>
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round"
            d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" />
    </Svg>
);

export const PauseIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none" {...props}>
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round"
            d="M4 7C4 5.58579 4 4.87868 4.43934 4.43934C4.87868 4 5.58579 4 7 4C8.41421 4 9.12132 4 9.56066 4.43934C10 4.87868 10 5.58579 10 7V17C10 18.4142 10 19.1213 9.56066 19.5607C9.12132 20 8.41421 20 7 20C5.58579 20 4.87868 20 4.43934 19.5607C4 19.1213 4 18.4142 4 17V7Z" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round"
            d="M14 7C14 5.58579 14 4.87868 14.4393 4.43934C14.8787 4 15.5858 4 17 4C18.4142 4 19.1213 4 19.5607 4.43934C20 4.87868 20 5.58579 20 7V17C20 18.4142 20 19.1213 19.5607 19.5607C19.1213 20 18.4142 20 17 20C15.5858 20 14.8787 20 14.4393 19.5607C14 19.1213 14 18.4142 14 17V7Z" />
    </Svg>
)


export const HeartIcon = (props: IconProps) => (
    <Svg width={props.size ?? 24} height={props.size ?? 24} viewBox={`0 0 24 24`} fill="none" {...props}>
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? "0.75"} strokeLinecap="round" strokeLinejoin="round"
            d="M10.4107 19.9679C7.58942 17.8581 2 13.035 2 8.69463C2 5.82581 4.10526 3.50018 7 3.50018C8.5 3.50018 10 4.00018 12 6.00018C14 4.00018 15.5 3.50018 17 3.50018C19.8947 3.50018 22 5.82581 22 8.69463C22 13.035 16.4106 17.8581 13.5893 19.9679C12.6399 20.6778 11.3601 20.6778 10.4107 19.9679Z" />
    </Svg>
)

// home page icons ===========
export const AuthUserIcon = ({ size = 32, ...props }: IconProps) => (
    <Svg
        width={size}
        height={32}
        viewBox="0 0 32 32"
        fill="none"
        {...props}
    >
        <Path
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round"
            d="M20.8852 13.4277C20.8852 10.5447 18.548 8.20748 15.665 8.20748C12.7819 8.20748 10.4447 10.5447 10.4447 13.4277C10.4447 16.3108 12.7819 18.648 15.665 18.648C18.548 18.648 20.8852 16.3108 20.8852 13.4277Z" />
        <Path
            fill={props?.color ?? 'currentColor'}
            d="M30.58 4.47875C30.58 2.41942 28.9106 0.75 26.8512 0.75C24.7919 0.75 23.1225 2.41942 23.1225 4.47875C23.1225 6.53808 24.7919 8.2075 26.8512 8.2075C28.9106 8.2075 30.58 6.53808 30.58 4.47875Z" />
        <Path
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" opacity={0.3}
            d="M18.648 1.04836C17.6842 0.852705 16.6865 0.75 15.665 0.75C7.42767 0.75 0.75 7.42767 0.75 15.665C0.75 23.9023 7.42767 30.58 15.665 30.58C23.9023 30.58 30.58 23.9023 30.58 15.665C30.58 14.6435 30.4772 13.6458 30.2817 12.682" />
        <Path
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round"
            d="M24.6139 27.597C24.6139 22.6546 20.6073 18.648 15.6649 18.648C10.7225 18.648 6.71594 22.6546 6.71594 27.597" />
    </Svg>
)


export const LanguageIcon = ({ size = 22, ...props }: IconProps) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 22 22"
        fill="none"
        {...props}
    >
        <Path d="M10.75 20.75C16.2728 20.75 20.75 16.2728 20.75 10.75C20.75 5.22715 16.2728 0.75 10.75 0.75C5.22715 0.75 0.75 5.22715 0.75 10.75C0.75 16.2728 5.22715 20.75 10.75 20.75Z"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" opacity={0.3}
        />
        <Path d="M5.75 7.12931H10.25M10.25 7.12931H13.25M10.25 7.12931V5.75M15.75 7.12931H13.25M13.25 7.12931C12.7225 9.0156 11.6179 10.7987 10.3571 12.3658M10.3571 12.3658C9.3131 13.6634 8.16205 14.8128 7.14286 15.75M10.3571 12.3658C9.7143 11.6121 8.8143 10.3926 8.55714 9.8409M10.3571 12.3658L12.2857 14.3707"
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round"
        />
    </Svg>
)

export const LanguageTranslationIcon = ({ size = 24, ...props }: IconProps) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round"
            d="M3.49744 5H7.99744M7.99744 5H13.4974M7.99744 5V3.5M4.99744 13.5C7.49744 11.5 10.4974 7.5 10.9974 5M6.49744 7.5C6.99744 9 8.99744 11.5 9.99744 12" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round"
            d="M4.99744 13.5C7.49744 11.5 10.4974 7.5 10.9974 5" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round"
            d="M11.4974 20.5005L14.1591 14.2898C14.9451 12.456 15.338 11.5391 15.9974 11.5391C16.6568 11.5391 17.0498 12.456 17.8357 14.2898L20.4974 20.5005" />
        <Path stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round"
            d="M13.4974 16.5H18.4974" />
    </Svg>
)

export const PlantIcon = ({ size = 24, ...props }: IconProps) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <Path
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" opacity={0.5}
            d="M18 10C18 10 12 14 12 21" />
        <Path
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round"
            d="M9.34882 11.1825C7.73784 12.3891 5.44323 12.26 3.9785 10.7953C1.55484 8.37164 2.03957 3.03957 2.03957 3.03957C2.03957 3.03957 7.37164 2.55484 9.7953 4.9785C10.7548 5.93803 11.1412 7.25369 10.9543 8.5" />
        <Path
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round"
            d="M14.9638 12.8175C13.644 11.3832 13.6797 9.14983 15.0708 7.75867C17.2252 5.6043 21.9648 6.03517 21.9648 6.03517C21.9648 6.03517 22.3957 10.7748 20.2413 12.9292C19.4877 13.6828 18.487 14.0386 17.5 13.9967" />
        <Path
            stroke="currentColor" strokeWidth={props?.strokeWidth ?? '1.5'} strokeLinecap="round" strokeLinejoin="round" opacity={0.5}
            d="M6 7C6 7 12 12 12 21" />
    </Svg>
)


export const TractorIcon = ({ size = 33, ...props }: IconProps) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 36 33"
        fill="none"
        {...props}
    >
        <Path
            d="M8.75017 31.2503C12.8923 31.2503 16.2502 27.8924 16.2502 23.7503C16.2502 19.6082 12.8923 16.2503 8.75017 16.2503C4.60801 16.2503 1.25012 19.6082 1.25012 23.7503C1.25012 27.8924 4.60801 31.2503 8.75017 31.2503Z"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M29.5834 31.2503C32.3448 31.2503 34.5834 29.0117 34.5834 26.2503C34.5834 23.4889 32.3448 21.2503 29.5834 21.2503C26.822 21.2503 24.5834 23.4889 24.5834 26.2503C24.5834 29.0117 26.822 31.2503 29.5834 31.2503Z"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M1.25012 13.7494C3.33928 12.1801 5.93613 11.2502 8.75017 11.2502C15.6537 11.2502 21.2502 16.8467 21.2502 23.7502C21.2502 23.9102 21.2472 24.0694 21.2412 24.2279C21.2034 25.2357 21.1844 25.7397 21.4304 25.9951C21.6762 26.2502 22.1306 26.2502 23.0393 26.2502H24.5836"
            stroke="#147A28"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M19.5837 11.2502L24.7599 12.2208C28.6615 12.9522 30.6123 13.3181 31.7646 14.7067C32.9172 16.0952 32.9172 18.0914 32.9172 22.0836"
            stroke="#147A28"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M31.2503 16.2503H29.5836"
            stroke="#147A28"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M19.5832 17.0836V12.2288C19.5832 11.5799 19.4886 10.9346 19.3021 10.3131L17.0832 1.25029M4.58313 11.2503V1.25029"
            stroke="#147A28"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M2.91663 1.25029H19.5834"
            stroke="#147A28"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M27.9171 12.0837V9.58368C27.9171 7.74273 29.4095 6.25035 31.2505 6.25035"
            stroke="#147A28"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path
            d="M9.58337 11.2503V1.25029"
            stroke="#147A28"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
);



export const ExploreServiceIcon = ({ size = 24, ...props }: IconProps) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <Path opacity={0.5} d="M9.94813 18.9526C9.80664 18.6111 9.80664 18.1781 9.80664 17.312C9.80664 16.4459 9.80664 16.0129 9.94813 15.6713C10.1367 15.2159 10.4986 14.854 10.9541 14.6654C11.2956 14.5239 11.7286 14.5239 12.5947 14.5239C13.4608 14.5239 13.8938 14.5239 14.2353 14.6654C14.6908 14.854 15.0527 15.2159 15.2413 15.6713C15.3828 16.0129 15.3828 16.4459 15.3828 17.312C15.3828 18.1781 15.3828 18.6111 15.2413 18.9526C15.0527 19.4081 14.6908 19.7699 14.2353 19.9586C13.8938 20.1 13.4608 20.1 12.5947 20.1C11.7286 20.1 11.2956 20.1 10.9541 19.9586C10.4986 19.7699 10.1367 19.4081 9.94813 18.9526Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <Path opacity={0.5} d="M2.14148 18.9526C2 18.6111 2 18.1781 2 17.312C2 16.4459 2 16.0129 2.14148 15.6713C2.33014 15.2159 2.69197 14.854 3.14741 14.6654C3.48899 14.5239 3.92201 14.5239 4.78806 14.5239C5.65411 14.5239 6.08713 14.5239 6.42871 14.6654C6.88414 14.854 7.24601 15.2159 7.43463 15.6713C7.57612 16.0129 7.57612 16.4459 7.57612 17.312C7.57612 18.1781 7.57612 18.6111 7.43463 18.9526C7.24601 19.4081 6.88414 19.7699 6.42871 19.9586C6.08713 20.1 5.65411 20.1 4.78806 20.1C3.92201 20.1 3.48899 20.1 3.14741 19.9586C2.69197 19.7699 2.33014 19.4081 2.14148 18.9526Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <Path opacity={0.5} d="M4.78806 6.71753C3.92201 6.71753 3.48899 6.71753 3.14741 6.85901C2.69197 7.04767 2.33014 7.4095 2.14148 7.86494C2 8.20652 2 8.63954 2 9.50559C2 10.3716 2 10.8047 2.14148 11.1462C2.33014 11.6017 2.69197 11.9635 3.14741 12.1522C3.48899 12.2936 3.92201 12.2936 4.78806 12.2936C5.65411 12.2936 6.08713 12.2936 6.42871 12.1522C6.88414 11.9635 7.24601 11.6017 7.43463 11.1462" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <Path opacity={0.5} d="M19.1408 8.98511C19.1408 8.98511 14.0107 12.4051 14.0107 18.3902" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M11.7442 9.99608C10.3668 11.0277 8.40492 10.9173 7.15256 9.66502C5.08032 7.59278 5.49477 3.03383 5.49477 3.03383C5.49477 3.03383 10.0537 2.61939 12.126 4.69163C12.9463 5.51203 13.2767 6.63693 13.1169 7.70253" stroke="#0A791E" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M16.5448 11.3939C15.4163 10.1676 15.4468 8.25806 16.6362 7.06862C18.4783 5.22662 22.5306 5.59501 22.5306 5.59501C22.5306 5.59501 22.8991 9.64742 21.057 11.4894C20.4127 12.1338 19.5571 12.438 18.7132 12.4022" stroke="#0A791E" strokeLinecap="round" strokeLinejoin="round" />
        <Path opacity={0.5} d="M8.88086 6.41992C8.88086 6.41992 14.0109 10.6949 14.0109 18.39" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
)


export const DroneDualIcon = (props: IconProps) => (
    <Svg width={props.size ?? 26} height={props.size ?? 26} viewBox={`0 0 26 26`} fill="none" {...props}>
        <Path opacity="0.2" d="M12 7C6.47715 7 2 7.89543 2 9C2 9.80571 4.38215 10.5001 7.81468 10.8169C8.43288 10.874 8.85702 11.4721 8.92296 12.0894C9.09436 13.6942 10.384 15 12 15C13.616 15 14.9056 13.6942 15.077 12.0894C15.143 11.4721 15.5671 10.874 16.1853 10.8169C19.6179 10.5001 22 9.80571 22 9C22 7.89543 17.5228 7 12 7Z" fill="currentColor" />
        <Path d="M12 7C6.47715 7 2 7.89543 2 9C2 9.80571 4.38215 10.5001 7.81468 10.8169C8.43288 10.874 8.85702 11.4721 8.92296 12.0894C9.09436 13.6942 10.384 15 12 15C13.616 15 14.9056 13.6942 15.077 12.0894C15.143 11.4721 15.5671 10.874 16.1853 10.8169C19.6179 10.5001 22 9.80571 22 9C22 7.89543 17.5228 7 12 7Z" stroke="currentColor" strokeWidth="0.75" strokeLinejoin="round" />
        <Path d="M11.9998 12H12.0088" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M4 3H6M8 3H6M6 3V7" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M16 3H18M20 3H18M18 3V7" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M5 21V19.5C5 16.7386 7.23858 14.5 10 14.5M19 21V19.5C19 16.7386 16.7614 14.5 14 14.5" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
)
