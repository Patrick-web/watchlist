import { animateLayout } from '@/utils/animation.utils';
import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

const useKeyboardVisibility = (onVisibilityChange?: (visible: boolean, height: number) => void) => {
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            (e) => {
                animateLayout()
                setKeyboardVisible(true);
                if (onVisibilityChange) {
                    onVisibilityChange(true, e.endCoordinates.height);
                }
            }
        );

        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            (e) => {
                animateLayout()
                setKeyboardVisible(false);
                if (onVisibilityChange) {
                    onVisibilityChange(false, 0);
                }
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [onVisibilityChange]);

    return keyboardVisible;
};

export default useKeyboardVisibility;