import Svg, {
    Path,
    SvgProps
} from "react-native-svg";

interface IconProps extends SvgProps {
    size?: number
}





export const WaterDropletIcon = ({
    size = 27,
    ...props
}: IconProps) => (
    <Svg
        width={size}
        height={(size * 27) / 32}
        viewBox="0 0 27 32"
        fill="none"
        {...props}
    >
        <Path d="M0.75 18.267C0.75 11.9908 6.12118 5.7886 9.8912 2.20833C11.9387 0.263891 15.0614 0.263891 17.1089 2.20833C20.8788 5.7886 26.25 11.9908 26.25 18.267C26.25 24.4206 21.4218 30.75 13.5 30.75C5.57817 30.75 0.75 24.4206 0.75 18.267Z"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path d="M19.5 18.75C19.5 22.0637 16.8137 24.75 13.5 24.75"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />

    </Svg>
)


export const WindIcon = ({
    size = 35,
    ...props
}: IconProps) => (
    <Svg
        width={size}
        height={(size * 35) / 32}
        viewBox="0 0 35 32"
        fill="none"
        {...props}
    >
        <Path d="M0.750061 5.65242C6.58339 11.3719 15.0426 8.92068 16.9707 5.65242C17.2544 5.17168 17.4167 4.61357 17.4167 4.01827C17.4167 2.21325 15.9244 0.75 14.0834 0.75C12.2424 0.75 10.7501 2.21325 10.7501 4.01827"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path d="M25.7501 10.6302C25.7501 7.93495 27.6156 5.75 29.9167 5.75C32.2179 5.75 34.0834 7.93495 34.0834 10.6302C34.0834 11.8253 33.7166 12.9202 33.1077 13.7685C29.6606 19.4025 12.8774 17.2773 4.0834 15.5105"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path d="M19.2257 28.8956C19.5689 29.9761 20.4949 30.7501 21.5834 30.7501C22.9641 30.7501 24.0834 29.5047 24.0834 27.9684C24.0834 27.4461 23.9541 26.9574 23.7289 26.5397C21.5832 22.4042 10.75 19.6232 0.750061 27.0411"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path d="M29.0834 21.5833H32.4167"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round" />
    </Svg>
)



export const RainIcon = ({
    size = 32,
    ...props
}: IconProps) => (
    <Svg
        width={size}
        height={(size * 32) / 32}
        viewBox="0 0 32 32"
        fill="none"
        {...props}
    >
        <Path d="M0.75 8.53538C0.75 5.74592 3.2074 2.98939 4.93226 1.39815C5.86901 0.53395 7.29768 0.53395 8.23443 1.39815C9.95928 2.98939 12.4167 5.74592 12.4167 8.53538C12.4167 11.2703 10.2077 14.0834 6.58334 14.0834C2.95897 14.0834 0.75 11.2703 0.75 8.53538Z"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path d="M9.91669 25.2021C9.91669 22.4125 12.3741 19.656 14.0989 18.0649C15.0357 17.2007 16.4644 17.2007 17.4012 18.0649C19.126 19.656 21.5834 22.4125 21.5834 25.2021C21.5834 27.9371 19.3744 30.7501 15.75 30.7501C12.1257 30.7501 9.91669 27.9371 9.91669 25.2021Z"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path d="M19.0834 8.53538C19.0834 5.74592 21.5407 2.98939 23.2655 1.39815C24.2024 0.53395 25.631 0.53395 26.5679 1.39815C28.2927 2.98939 30.7501 5.74592 30.7501 8.53538C30.7501 11.2703 28.5411 14.0834 24.9167 14.0834C21.2924 14.0834 19.0834 11.2703 19.0834 8.53538Z"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>
)


export const AirPressureIcon = ({
    size = 32,
    ...props
}: IconProps) => (
    <Svg
        width={size}
        height={(size * 32) / 32}
        viewBox="0 0 32 32"
        fill="none"
        {...props}
    >
        <Path d="M18.1183 17.329L23.6446 11.0132M18.9078 20.4868C18.9078 22.231 17.494 23.6447 15.7499 23.6447C14.0058 23.6447 12.592 22.231 12.592 20.4868C12.592 18.7427 14.0058 17.329 15.7499 17.329C17.494 17.329 18.9078 18.7427 18.9078 20.4868Z"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path d="M6.27621 15.75C6.27621 10.5179 10.5177 6.27637 15.7499 6.27637C17.4755 6.27637 19.0933 6.7377 20.4867 7.54377"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <Path d="M0.75 15.75C0.75 8.67892 0.75 5.1434 2.94669 2.94669C5.1434 0.75 8.67892 0.75 15.75 0.75C22.821 0.75 26.3566 0.75 28.5532 2.94669C30.75 5.1434 30.75 8.67892 30.75 15.75C30.75 22.821 30.75 26.3566 28.5532 28.5532C26.3566 30.75 22.821 30.75 15.75 30.75C8.67892 30.75 5.1434 30.75 2.94669 28.5532C0.75 26.3566 0.75 22.821 0.75 15.75Z"
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </Svg>

)