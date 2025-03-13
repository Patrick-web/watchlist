import { sHeight } from "@/constants/dimensions.constant";
import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity, FlatList } from "react-native";
import Box from "./Box";
import ThemedButton, { ThemedButtonProps } from "./ThemedButton";
import ThemedIcon from "./ThemedIcon";
import ThemedModal from "./ThemedModal";
import ThemedText from "./ThemedText";
import ThemedTextInput, { ThemedTextInputProps } from "./ThemedTextInput";

type Obj = { [key: string]: any };

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

export function ThemedSearchInput(
  props: ThemedTextInputProps & { clear?: () => void },
) {
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
            <ThemedButton
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

export function ThemedSelectInput<T extends Obj[]>(
  props: ThemedSelectProps<T>,
) {
  const [selectedOption, setSelectedOption] = useState<Record<string, any>>(
    props.selected as any,
  );
  const [showOptionPicker, setShowOptionPicker] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<T[number][]>(
    props.options,
  );

  const filterOptions = useCallback(
    (query: string) => {
      const found = props.options.filter((option) =>
        option[props.labelProperty]
          .toString()
          .toLowerCase()
          .includes(query.toLowerCase()),
      );
      setFilteredOptions(found);
    },
    [props.options, props.labelProperty],
  );

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
            <ThemedButton
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
          <ThemedSearchInput
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

  const [filteredOptions, setFilteredOptions] = useState<T[number][]>(
    props.options,
  );

  const filterOptions = useCallback(
    (query: string) => {
      const found = props.options.filter((option) =>
        option[props.labelProperty]
          .toString()
          .toLowerCase()
          .includes(query.toLowerCase()),
      );

      setFilteredOptions(found);
    },
    [props.options, props.labelProperty],
  );

  useEffect(() => {
    setSelectedOption(props.selected);

    filterOptions("");
  }, [props.selected, filterOptions]);

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
          <ThemedSearchInput
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

type KeysUnion<T extends Obj[]> = T extends (infer U)[] ? keyof U : never; // Extract keys union from array of objects

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
