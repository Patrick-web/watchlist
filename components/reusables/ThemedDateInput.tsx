import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import Box from "./Box";
import ThemedButton from "./ThemedButton";
import ThemedIcon from "./ThemedIcon";
import ThemedModal from "./ThemedModal";
import ThemedTextInput, { ThemedTextInputProps } from "./ThemedTextInput";

export function ThemedDateInput({
  onInput,
  value = new Date(),
  minDate,
  maxDate,
  ...props
}: ThemedDateInputProps) {
  const [date, setDate] = useState<Date>(minDate || value);
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (date && typeof date === "object") {
      onInput(date);
    }
  }, [date]);

  return (
    <>
      <ThemedButton
        type="text"
        onPress={() => setShowDatePicker(true)}
        align="stretch"
      >
        <ThemedTextInput
          placeholder=""
          value={date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
          {...props}
          wrapper={{ viewProps: { pointerEvents: "none" }, ...props.wrapper }}
          rightSlot={
            <Box pr={15} align="center" justify="center">
              <ThemedIcon name={"calendar"} />
            </Box>
          }
        />
      </ThemedButton>
      {Platform.OS === "android" ? (
        <>
          {showDatePicker && (
            <DateTimePicker
              testID="datePicker"
              value={date}
              mode={"date"}
              display={"default"}
              onChange={(event, selectedDate) => {
                console.log("Selected Date", selectedDate);
                if (selectedDate) {
                  setDate(selectedDate);
                }
                setShowDatePicker(false);
              }}
              minimumDate={minDate}
              maximumDate={maxDate}
            />
          )}
        </>
      ) : (
        <ThemedModal
          visible={showDatePicker}
          transparent
          close={() => {
            setShowDatePicker(false);
          }}
          position="bottom"
        >
          <DateTimePicker
            testID="datePicker"
            value={date}
            mode={"date"}
            display={"inline"}
            onChange={(event, selectedDate) => {
              console.log("Selected Date", selectedDate);
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
            onPress={() => {
              setShowDatePicker(false);
            }}
          />
        </ThemedModal>
      )}
    </>
  );
}

interface ThemedDateInputProps extends Omit<ThemedTextInputProps, "value"> {
  onInput: (value: Date) => void;
  value?: Date;
  minDate?: Date;
  maxDate?: Date;
}
