import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import Box from "./Box";
import ThemedButton from "./ThemedButton";
import ThemedIcon from "./ThemedIcon";
import ThemedModal from "./ThemedModal";
import ThemedTextInput, { ThemedTextInputProps } from "./ThemedTextInput";
import ThemedBottomSheet from "./ThemedBottomSheet";

export function ThemedDatePicker({
  onPickDate,
  showPicker,
  onClosePicker,
  value,
  minDate,
  maxDate,
  ...props
}: ThemedDatePickerProps) {
  const [date, setDate] = useState<Date | undefined>(value);

  useEffect(() => {
    if (date && typeof date === "object") {
      onPickDate(date);
    }
  }, [date]);

  return (
    <>
      {Platform.OS === "android" ? (
        <>
          {showPicker && (
            <DateTimePicker
              testID="datePicker"
              value={date || value || minDate || new Date()}
              mode={"date"}
              display={"default"}
              onChange={(event, selectedDate) => {
                if (selectedDate) {
                  setDate(selectedDate);
                }
                onClosePicker();
              }}
              minimumDate={minDate}
              maximumDate={maxDate}
            />
          )}
        </>
      ) : (
        <ThemedBottomSheet
          visible={showPicker}
          close={() => {
            onClosePicker();
          }}
          containerProps={{ alignItems: "center", justify: "center", px: 40 }}
        >
          <DateTimePicker
            testID="datePicker"
            value={date || value || minDate || new Date()}
            mode={"date"}
            display={"inline"}
            onChange={(event, selectedDate) => {
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
            minimumDate={minDate}
            maximumDate={maxDate}
          />
          <ThemedButton
            label={"Done"}
            type="surface"
            block
            onPress={() => {
              onClosePicker();
            }}
          />
        </ThemedBottomSheet>
      )}
    </>
  );
}

interface ThemedDatePickerProps extends Omit<ThemedTextInputProps, "value"> {
  value?: Date;
  minDate?: Date;
  maxDate?: Date;
  onPickDate: (value: Date) => void;
  showPicker: boolean;
  onClosePicker: () => void;
}
