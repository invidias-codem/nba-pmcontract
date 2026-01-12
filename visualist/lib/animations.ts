import { withSpring, withTiming, withSequence, withRepeat } from 'react-native-reanimated';

// Spring configurations
export const springConfig = {
    damping: 15,
    stiffness: 150,
    mass: 1,
};

export const gentleSpring = {
    damping: 20,
    stiffness: 90,
    mass: 0.8,
};

export const bouncySpring = {
    damping: 10,
    stiffness: 200,
    mass: 1.2,
};

// Timing configurations
export const quickTiming = {
    duration: 200,
};

export const mediumTiming = {
    duration: 400,
};

export const slowTiming = {
    duration: 800,
};

// Animation presets
export const shakeAnimation = (intensity: number = 10) => {
    return withSequence(
        withTiming(intensity, { duration: 50 }),
        withTiming(-intensity, { duration: 50 }),
        withTiming(intensity, { duration: 50 }),
        withTiming(-intensity, { duration: 50 }),
        withTiming(0, { duration: 50 })
    );
};

export const pulseAnimation = (scale: number = 1.1) => {
    return withRepeat(
        withSequence(
            withTiming(scale, { duration: 1000 }),
            withTiming(1, { duration: 1000 })
        ),
        -1,
        true
    );
};

export const fadeIn = () => {
    return withTiming(1, { duration: 400 });
};

export const fadeOut = () => {
    return withTiming(0, { duration: 400 });
};

export const slideInFromBottom = () => {
    return withSpring(0, springConfig);
};

export const flipCard = () => {
    return withTiming(180, { duration: 600 });
};

// Breathing animation for idle state
export const breathingAnimation = () => {
    return withRepeat(
        withSequence(
            withTiming(1.05, { duration: 2000 }),
            withTiming(1, { duration: 2000 })
        ),
        -1,
        true
    );
};

// Glow pulse animation
export const glowPulse = () => {
    return withRepeat(
        withSequence(
            withTiming(1, { duration: 800 }),
            withTiming(0.3, { duration: 800 })
        ),
        -1,
        true
    );
};
