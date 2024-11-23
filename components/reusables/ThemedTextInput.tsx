import { sHeight } from "@/constants/dimensions.constant";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, {
  ReactNode,
  Ref,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  FlatList,
  Platform,
  TextInput,
  TextInputProps,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../../hooks/useTheme.hook";
import Box, { BoxProps } from "./Box";
import Spacer from "./Spacer";
import ThemedButton, {
  ThemedButtonProps,
  ThemedIconButton,
} from "./ThemedButton";
import ThemedIcon from "./ThemedIcon";
import ThemedModal from "./ThemedModal";
import ThemedText, { ThemedTextProps } from "./ThemedText";

export default function ThemedTextInput({
  wrapper,
  errorMessage,
  errors,
  leftSlot,
  leftSlotProps,
  rightSlot,
  rightSlotProps,
  dense,
  label,
  labelProps,
  size = "md",
  textInputRef,
  forBottomSheet = false,
  ...input
}: ThemedTextInputProps) {
  const theme = useTheme();

  const sizeStyles = getTextStyles(size);

  const TextInputComponent = forBottomSheet ? BottomSheetTextInput : TextInput;

  return (
    <Box>
      {label && (
        <>
          <ThemedText size={"sm"} {...labelProps}>
            {label}
          </ThemedText>
          <Spacer height={5} />
        </>
      )}
      <>
        <Box
          radius={14}
          borderWidth={1}
          direction="row"
          align="stretch"
          borderColor={theme.stroke}
          color={theme.surface2}
          {...wrapper}
        >
          {leftSlot && (
            <Box
              pl={sizeStyles.paddingHorizontal / 2}
              align="center"
              justify="center"
              {...leftSlotProps}
            >
              {leftSlot}
            </Box>
          )}

          <TextInputComponent
            ref={textInputRef as any}
            placeholderTextColor={theme.text}
            {...input}
            style={[
              {
                flex: 1,
                paddingLeft: leftSlot
                  ? sizeStyles.paddingHorizontal / 4
                  : sizeStyles.paddingHorizontal,
                paddingVertical:
                  Platform.OS === "ios"
                    ? sizeStyles.paddingVertical
                    : sizeStyles.paddingVertical / 1.5,
                fontFamily: "Poppins",
                fontSize: sizeStyles.fontSize,
                color: theme.text,
              },
              input.style,
            ]}
          />
          {rightSlot && (
            <Box align="center" justify="center" {...rightSlotProps}>
              {rightSlot}
            </Box>
          )}
        </Box>

        {errorMessage && (
          <ThemedText color={theme.danger} size={12}>
            {errorMessage}
          </ThemedText>
        )}
        {errors && errorMessage?.length && (
          <Box block>
            {errors.map((err) => (
              <ThemedText key={err} color={theme.danger} size={12}>
                {err}
              </ThemedText>
            ))}
          </Box>
        )}
      </>
    </Box>
  );
}

export function ThemedEmailInput(props: ThemedTextInputProps) {
  return (
    <ThemedTextInput
      autoCapitalize="none"
      placeholder="Email"
      keyboardType="email-address"
      leftSlot={<ThemedIcon name="mail" />}
      leftSlotProps={{
        mx: 10,
      }}
      {...props}
    />
  );
}

export function ThemedPasswordInput(props: ThemedTextInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <ThemedTextInput
      placeholder="Password"
      {...props}
      secureTextEntry={!showPassword}
      autoCapitalize={"none"}
      rightSlot={
        <ThemedButton
          type="text"
          onPress={() => setShowPassword((value) => !value)}
          icon={{
            name: showPassword ? "eye-off" : "eye",
            position: "append",
          }}
          size="sm"
        />
      }
      leftSlot={<ThemedIcon name="lock" />}
      leftSlotProps={{
        mx: 10,
      }}
    />
  );
}

export function ThemedSearchInput(props: ThemedSearchInputProps) {
  const [value, setValue] = useState(props.value || "");

  return (
    <ThemedTextInput
      placeholder="Search"
      value={value}
      {...props}
      onChangeText={(value) => {
        setValue(value);
        if (props.onChangeText) props.onChangeText(value);
      }}
      leftSlot={<ThemedIcon name="search" />}
      leftSlotProps={{
        px: 10,
        ml: 10,
      }}
      rightSlot={
        <>
          {value ? (
            <ThemedIconButton
              icon={{ name: "x" }}
              onPress={() => {
                setValue("");
                props.onChangeText && props.onChangeText("");
                if (props.clear) props.clear();
              }}
            />
          ) : (
            <></>
          )}
        </>
      }
    />
  );
}

export const ThemedCityInput = forwardRef(
  (props: ThemedCityInputProps, ref: Ref<ThemedCityInputExposed>) => {
    const [city, setCity] = useState<City | null>(null);
    const [showCityPicker, setShowCityPicker] = useState(false);

    function reset() {
      setCity(null);
    }

    useImperativeHandle(ref, () => ({
      reset,
    }));

    return (
      <>
        <TouchableOpacity onPress={() => setShowCityPicker(true)}>
          <ThemedTextInput
            placeholder="City"
            value={city?.name || ""}
            {...props}
            wrapper={{ viewProps: { pointerEvents: "none" }, ...props.wrapper }}
            rightSlot={<ThemedIconButton icon={{ name: "chevron-down" }} />}
          />
        </TouchableOpacity>
        <CityModal
          close={() => setShowCityPicker(false)}
          onSelect={(value) => {
            setCity(value);
            setShowCityPicker(false);
            if (props.onInput) props.onInput(value);
          }}
          visible={showCityPicker}
          selectedCityId={props.selectedCityId}
        />
      </>
    );
  },
);

export function CityModal({
  onSelect,
  close,
  visible,
  selectedCityId,
}: {
  onSelect: (value: City) => void;
  close: () => void;
  visible: boolean;
  selectedCityId?: string;
}) {
  const theme = useTheme();

  // const { cities } = useSelector((state: RootState) => state.auth);
  const cities: any[] = [];
  // TODO: Fetch cities

  const [filteredCities, setFilteredCities] = useState<typeof cities>(cities);

  function filterCities(query: string) {
    const found = cities.filter((city) =>
      city.name.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredCities(found);
  }

  useEffect(() => {
    if (selectedCityId) {
      const selectedCity = cities.find(
        (city) => city.id.toString() === selectedCityId,
      );
      if (selectedCity) onSelect(selectedCity);
    }
  }, []);

  useEffect(() => {
    setFilteredCities(cities);
    onSelect(cities[0]);
  }, [cities]);

  return (
    <ThemedModal position="bottom" visible={visible} transparent close={close}>
      <Box height={sHeight - 100} gap={10} block>
        <ThemedTextInput
          placeholder="Search City"
          leftSlot={<ThemedIcon name="search" />}
          onChangeText={(value) => {
            filterCities(value);
          }}
        />
        <Box block flex={1}>
          <FlatList
            data={filteredCities}
            renderItem={({ item: city }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    onSelect(city);
                  }}
                >
                  <Box key={city.id} direction="row" block pa={20} gap={10}>
                    <ThemedText>{city.name}</ThemedText>
                  </Box>
                </TouchableOpacity>
              );
            }}
          />
        </Box>
      </Box>
    </ThemedModal>
  );
}

export function ThemedSelectInput<T extends Obj[]>(
  props: ThemedSelectProps<T>,
) {
  const [selectedOption, setSelectedOption] = useState<Record<string, any>>(
    props.selected as any,
  );
  const [showOptionPicker, setShowOptionPicker] = useState(false);

  const theme = useTheme();

  const [filteredOptions, setFilteredOptions] = useState<T[number][]>(
    props.options,
  );

  function filterOptions(query: string) {
    const found = props.options.filter((option) =>
      option[props.labelProperty]
        .toString()
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
    setFilteredOptions(found);
  }

  return (
    <>
      <TouchableOpacity onPress={() => setShowOptionPicker(true)}>
        <ThemedTextInput
          placeholder="Select"
          value={
            selectedOption
              ? selectedOption[props.labelProperty]?.toString()
              : "Select"
          }
          {...props}
          wrapper={{ viewProps: { pointerEvents: "none" }, ...props.wrapper }}
          rightSlot={
            <ThemedIconButton
              icon={{ name: "chevron-down" }}
              onPress={() => setShowOptionPicker(true)}
            />
          }
        />
      </TouchableOpacity>

      <ThemedModal
        position="bottom"
        visible={showOptionPicker}
        containerProps={{
          height: Math.min(props.options.length * 60, sHeight - 100),
        }}
        close={() => setShowOptionPicker(false)}
        title={props.label || "Select"}
      >
        {props.enableSearch && (
          <ThemedTextInput
            placeholder="Search"
            leftSlot={<ThemedIcon name="search" />}
            onChangeText={(value) => {
              filterOptions(value);
            }}
          />
        )}
        <FlatList
          data={filteredOptions}
          renderItem={({ item: option }) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  if (props.onInput) props.onInput(option);
                  setSelectedOption(option);
                  setShowOptionPicker(false);
                }}
              >
                <Box
                  key={option[props.labelProperty]}
                  direction="row"
                  block
                  pa={10}
                  gap={10}
                >
                  <ThemedText>{option[props.labelProperty]}</ThemedText>
                </Box>
              </TouchableOpacity>
            );
          }}
        />
      </ThemedModal>
    </>
  );
}
export function ThemedOptionsPicker<T extends Obj[]>(
  props: ThemedOptionsPickerProps<T>,
) {
  const [selectedOption, setSelectedOption] = useState<
    Record<string, any> | null | undefined
  >(props.selected as any);
  const [showOptionPicker, setShowOptionPicker] = useState(false);

  const theme = useTheme();

  const [filteredOptions, setFilteredOptions] = useState<T[number][]>(
    props.options,
  );

  function filterOptions(query: string) {
    const found = props.options.filter((option) =>
      option[props.labelProperty]
        .toString()
        .toLowerCase()
        .includes(query.toLowerCase()),
    );
    setFilteredOptions(found);
  }

  useEffect(() => {
    setSelectedOption(props.selected);
    filterOptions("");
  }, [props.selected]);

  return (
    <>
      <ThemedButton
        {...props}
        label={
          selectedOption
            ? selectedOption[props.labelProperty].toString()
            : props.label
              ? props.label
              : "Select"
        }
        icon={{ name: "chevron-down", position: "append" }}
        onPress={() => setShowOptionPicker(true)}
        type={selectedOption ? "secondary" : "surface"}
      />

      <ThemedModal
        position="bottom"
        visible={showOptionPicker}
        containerProps={{
          height: Math.min(props.options.length * 50, sHeight - 120),
          radiusTop: 20,
          pa: 10,
          pb: 0,
        }}
        close={() => setShowOptionPicker(false)}
        title={`Select ${props.label}`}
      >
        {props.enableSearch && (
          <ThemedTextInput
            placeholder="Search"
            leftSlot={<ThemedIcon name="search" />}
            onChangeText={(value) => {
              filterOptions(value);
            }}
          />
        )}
        <FlatList
          data={filteredOptions}
          renderItem={({ item: option }) => {
            return (
              <Box align="flex-start" key={option[props.labelProperty]} block>
                <ThemedButton
                  label={option[props.labelProperty]}
                  type={selectedOption === option ? "secondary" : "text"}
                  size="sm"
                  onPress={() => {
                    if (props.onInput) props.onInput(option);
                    setSelectedOption(option);
                    setShowOptionPicker(false);
                  }}
                  width={"100%"}
                  wrapperProps={{ justify: "flex-start" }}
                  radius={15}
                />
              </Box>
            );
          }}
        />
      </ThemedModal>
    </>
  );
}
type _BoxProps = Omit<BoxProps, "children">;

interface SlotProps extends _BoxProps {
  spacing?: number;
}

export interface ThemedTextInputProps extends TextInputProps {
  wrapper?: Omit<BoxProps, "children">;
  errorMessage?: string | null | undefined;
  errors?: string[];
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  leftSlotProps?: SlotProps;
  rightSlotProps?: SlotProps;
  label?: string;
  labelProps?: ThemedTextProps;
  dense?: boolean;
  size?: InputSize;
  textInputRef?: Ref<TextInput>;
  forBottomSheet?: boolean;
}

interface ThemedSearchInputProps extends ThemedTextInputProps {
  onInput?: (value: string) => void;
  clear?: () => void;
}

type Obj = { [key: string]: any }; // Define a general object type

type KeysUnion<T extends Obj[]> = T extends Array<infer U> ? keyof U : never; // Extract keys union from array of objects

interface ThemedSelectProps<T extends Obj[]> extends ThemedTextInputProps {
  options: T;
  labelProperty: KeysUnion<T>;
  enableSearch?: boolean;
  selected?: T[number];
  onInput?: (selectedOption: T[number]) => void;
}

interface ThemedOptionsPickerProps<T extends Obj[]> extends ThemedButtonProps {
  options: T;
  labelProperty: KeysUnion<T>;
  enableSearch?: boolean;
  selected?: T[number] | null;
  onInput?: (selectedOption: T[number]) => void;
}

type InputSize =
  | "xxxs"
  | "xxs"
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "xxl"
  | "xxxl";

interface InputStyles {
  paddingVertical: number;
  paddingHorizontal: number;
  fontSize: number;
}

const getTextStyles = (size: InputSize): InputStyles => {
  let styles: InputStyles = {
    paddingVertical: 14,
    paddingHorizontal: 18,
    fontSize: 16,
  };

  switch (size) {
    case "xxxs":
      styles = {
        paddingVertical: 6,
        paddingHorizontal: 10,
        fontSize: 6,
      };
      break;
    case "xxs":
      styles = {
        paddingVertical: 2,
        paddingHorizontal: 12,
        fontSize: 8,
      };
      break;
    case "xs":
      styles = {
        paddingVertical: 0,
        paddingHorizontal: 14,
        fontSize: 10,
      };
      break;
    case "sm":
      styles = {
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 12,
      };
      break;
    case "md":
      styles = {
        paddingVertical: 12,
        paddingHorizontal: 16,
        fontSize: 14,
      };
      break;
    case "lg":
      styles = {
        paddingVertical: 16,
        paddingHorizontal: 20,
        fontSize: 16,
      };
      break;
    case "xl":
      styles = {
        paddingVertical: 18,
        paddingHorizontal: 22,
        fontSize: 18,
      };
      break;
    case "xxl":
      styles = {
        paddingVertical: 20,
        paddingHorizontal: 24,
        fontSize: 20,
      };
      break;
    case "xxxl":
      styles = {
        paddingVertical: 22,
        paddingHorizontal: 26,
        fontSize: 22,
      };
      break;
    default:
      // Default values already set
      break;
  }

  return styles;
};
