import { useTheme } from "@/hooks/useTheme.hook";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { useState } from "react";
import { ScrollView } from "react-native";
import Box from "./Box";
import ThemedBottomSheet from "./ThemedBottomSheet";
import ThemedButton from "./ThemedButton";
import ThemedIcon from "./ThemedIcon";
import ThemedTextInput, { ThemedTextInputProps } from "./ThemedTextInput";

export function ThemedMultiSelect(props: ThemedMultiSelectProps) {
  const [selectedOptions, setSelectedOptions] = useState<Option[]>(
    prepedOptions(props.selected || []),
  );
  const [showOptionPicker, setShowOptionPicker] = useState(false);

  const theme = useTheme();

  const [filteredOptions, setFilteredOptions] = useState<Option[]>(
    prepedOptions(props.options || []),
  );

  function filterOptions(query: string) {
    const found = prepedOptions(props.options).filter((option) =>
      option.label.toString().toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredOptions(found);
  }

  return (
    <Box>
      <ThemedTextInput
        placeholder={selectedOptions.length ? "" : props.placeholder}
        onFocus={() => setShowOptionPicker(true)}
        {...props}
        editable={false}
        rightSlot={
          <ThemedButton
            icon={{ name: "chevron-down" }}
            onPress={() => setShowOptionPicker(true)}
            type="text"
          />
        }
      />
      <Box
        width={"85%"}
        position="absolute"
        bottom={"10%"}
        left={5}
        radius={20}
        overflow="hidden"
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {selectedOptions.map((option) => (
            <ThemedButton
              key={option.value}
              label={option.label}
              icon={{
                name: "x",
              }}
              mx={5}
              type="surface"
              color={theme.surface2}
              size="xxs"
              onPress={() => {
                setSelectedOptions(
                  selectedOptions.filter(
                    (selectedOption) => selectedOption.value !== option.value,
                  ),
                );
                props.onSelect(
                  selectedOptions.filter(
                    (selectedOption) => selectedOption.value !== option.value,
                  ),
                );
              }}
            />
          ))}
        </ScrollView>
      </Box>

      <ThemedBottomSheet
        snapPoints={["50%"]}
        visible={showOptionPicker}
        close={() => setShowOptionPicker(false)}
        title={props.label || "Select"}
        enableDynamicSizing={false}
        footer={
          <ThemedButton
            label="Done"
            onPress={() => setShowOptionPicker(false)}
            size="sm"
            ma={20}
          />
        }
        noContainer
      >
        <Box>
          {props.enableSearch && (
            <ThemedTextInput
              placeholder="Search"
              leftSlot={<ThemedIcon name="search" />}
              onChangeText={(value) => {
                filterOptions(value);
              }}
              forBottomSheet
              wrapper={{
                mx: 10,
                radius: 40,
              }}
            />
          )}
          <BottomSheetFlatList
            data={filteredOptions}
            style={{
              marginBottom: 150,
            }}
            renderItem={({ item: option }) => {
              return (
                <ThemedButton
                  label={option.label}
                  wrapperProps={{
                    justify: "flex-start",
                    gap: 10,
                  }}
                  icon={{
                    name: selectedOptions
                      .map((option) => option.value)
                      .includes(option.value)
                      ? "check"
                      : "circle",
                    color: selectedOptions
                      .map((option) => option.value)
                      .includes(option.value)
                      ? theme.primary
                      : theme.text,
                  }}
                  labelProps={{
                    color: selectedOptions
                      .map((option) => option.value)
                      .includes(option.value)
                      ? theme.primary
                      : theme.text,
                    fontWeight: selectedOptions
                      .map((option) => option.value)
                      .includes(option.value)
                      ? "bold"
                      : "regular",
                  }}
                  type="text"
                  size="sm"
                  borderBottomColor={theme.lightBackground}
                  borderBottomWidth={1}
                  borderWidth={0}
                  radius={0}
                  borderColor={theme.lightBackground}
                  onPress={() => {
                    if (
                      selectedOptions
                        .map((option) => option.value)
                        .includes(option.value)
                    ) {
                      setSelectedOptions(
                        selectedOptions.filter(
                          (selectedOption) =>
                            selectedOption.value !== option.value,
                        ),
                      );
                      props.onSelect(
                        selectedOptions.filter(
                          (selectedOption) =>
                            selectedOption.value !== option.value,
                        ),
                      );
                    } else {
                      setSelectedOptions([...selectedOptions, option]);
                      props.onSelect([...selectedOptions, option]);
                    }
                  }}
                />
              );
            }}
          />
        </Box>
      </ThemedBottomSheet>
    </Box>
  );
}

function prepedOptions(options: Option[] | string[]): Option[] {
  if (typeof options[0] === "string") {
    const preped = options.map((op) => ({
      label: op,
      value: op,
    }));

    return preped as Option[];
  } else {
    return options as Option[];
  }
}

interface Option {
  label: string;
  value: string;
}

interface ThemedMultiSelectProps extends ThemedTextInputProps {
  options: Option[] | string[];
  enableSearch?: boolean;
  selected?: Option[] | string[];
  onSelect: (selectedOptions: Option[]) => void;
}
