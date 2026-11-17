import { Input } from "@ultima-zebar/ui";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

interface NumberInputProps
	extends Omit<React.ComponentProps<typeof Input>, "onChange" | "value"> {
	value: number;
	onChange: (newValue: number) => void;
	debounceMs?: number;
}

export function NumberInput({
	value,
	onChange,
	debounceMs = 500,
	...props
}: NumberInputProps) {
	const [internalValue, setInternalValue] = useState(String(value));
	const [debouncedValue] = useDebounce(internalValue, debounceMs);

	// Latest values/handler for the unmount flush below, so it commits the
	// pending edit without a stale closure. Updated in an effect rather than
	// during render to stay compatible with the React Compiler.
	const latestRef = useRef({ internalValue, value, onChange });
	useEffect(() => {
		latestRef.current = { internalValue, value, onChange };
	});

	// Flush a pending edit when the input unmounts (e.g. the config widget
	// is closed right after typing, before the debounce elapses).
	useEffect(() => {
		return () => {
			const { internalValue: latest, value: latestValue } = latestRef.current;
			const numericValue = parseInt(latest, 10);
			if (!Number.isNaN(numericValue) && numericValue !== latestValue) {
				latestRef.current.onChange(numericValue);
			}
		};
	}, []);

	// Effect to sync from parent (external changes)
	useEffect(() => {
		if (parseInt(internalValue, 10) !== value) {
			setInternalValue(String(value));
		}
	}, [value]);

	// Effect to commit debounced changes to parent
	useEffect(() => {
		const numericValue = parseInt(debouncedValue, 10);
		if (!Number.isNaN(numericValue) && numericValue !== value) {
			onChange(numericValue);
		}
	}, [debouncedValue]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInternalValue(e.target.value);
	};

	const handleBlur = () => {
		const numericValue = parseInt(internalValue, 10);
		if (Number.isNaN(numericValue)) {
			// If the user leaves the input in an invalid state, revert it.
			setInternalValue(String(value));
			return;
		}
		// Commit immediately on blur instead of waiting for the debounce.
		if (numericValue !== value) {
			onChange(numericValue);
		}
	};

	return (
		<Input
			{...props}
			type="number"
			value={internalValue}
			className="h-full"
			onChange={handleInputChange}
			onBlur={handleBlur}
		/>
	);
}