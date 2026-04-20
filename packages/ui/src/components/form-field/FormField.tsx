import { AlertTriangle } from "lucide-react";
import React, { useId } from "react";
import { cn } from "../../utils/cn";

interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	switch?: boolean;
}

function isFieldTitle(
	child: React.ReactNode,
): child is React.ReactElement<React.HTMLAttributes<HTMLSpanElement>> {
	return React.isValidElement(child) && child.type === FieldTitle;
}

function isFieldInput(
	child: React.ReactNode,
): child is React.ReactElement<React.HTMLAttributes<HTMLDivElement>> {
	return React.isValidElement(child) && child.type === FieldInput;
}

function isFieldDescription(
	child: React.ReactNode,
): child is React.ReactElement<React.HTMLAttributes<HTMLParagraphElement>> {
	return React.isValidElement(child) && child.type === FieldDescription;
}

export function FormField({
	children,
	className,
	switch: isSwitch,
	id: customId,
	...props
}: FormFieldProps) {
	const generatedId = useId();
	const id = customId || generatedId;

	const childrenArray = React.Children.toArray(children);

	const titleElement = childrenArray.find(isFieldTitle);
	const inputElement = childrenArray.find(isFieldInput);
	const descriptionElement = childrenArray.find(isFieldDescription);

	const title = titleElement;

	const input = inputElement
		? React.cloneElement(inputElement, {
				id,
			})
		: inputElement;

	return (
		<div className={cn(className, !isSwitch && "space-y-3")} {...props}>
			{isSwitch ? (
				<div
					className={cn("flex gap-4", !descriptionElement && "items-center")}
				>
					{input}
					<div className="space-y-1.5">
						<label
							htmlFor={id}
							className="text-text font-medium leading-none block cursor-pointer"
						>
							{React.isValidElement(titleElement)
								? titleElement.props.children
								: titleElement}
						</label>
						{descriptionElement}
					</div>
				</div>
			) : (
				<>
					{title}
					{input}
					{descriptionElement}
				</>
			)}
		</div>
	);
}

interface FieldTitleProps extends React.HTMLAttributes<HTMLSpanElement> {
	children: React.ReactNode;
}

export function FieldTitle({ children, className, ...props }: FieldTitleProps) {
	return (
		<span
			className={cn("text-text font-medium block mb-1.5", className)}
			{...props}
		>
			{children}
		</span>
	);
}
FieldTitle.displayName = "FieldTitle";

interface FieldInputProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
}

export function FieldInput({
	children,
	className,
	id,
	...props
}: FieldInputProps) {
	return (
		<div className={cn("", className)} {...props}>
			{React.isValidElement(children)
				? React.cloneElement(children as React.ReactElement<{ id?: string }>, {
						id,
					})
				: children}
		</div>
	);
}
FieldInput.displayName = "FieldInput";

interface FieldDescriptionProps
	extends React.HTMLAttributes<HTMLParagraphElement> {
	children: React.ReactNode;
	warning?: boolean;
}

export function FieldDescription({
	children,
	className,
	warning,
	...props
}: FieldDescriptionProps) {
	return (
		<div className={cn("text-text-muted space-y-1", className)} {...props}>
			{warning && (
				<span className="flex items-center gap-2 text-text">
					<AlertTriangle className="text-warning h-5 w-5" strokeWidth={2.5} />
					Only amend if you know what you are doing
				</span>
			)}
			<p>{children}</p>
		</div>
	);
}
FieldDescription.displayName = "FieldDescription";