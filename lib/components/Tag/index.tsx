import React, { PropsWithChildren, useState } from "react";
import "./style.css";
interface TagProps {
	color: string;
	closable?: boolean;
	onClose?: () => void;
	tagref?: React.Ref<HTMLDivElement>;
	className?: string;
}

const Tag: React.FC<TagProps & PropsWithChildren> = ({
	children,
	color,
	closable = false,
	onClose,
	tagref,
	className = "",
}) => {
	const [closed, setClosed] = useState(false);

	const handleClose = () => {
		setClosed(true);
		if (onClose) {
			onClose();
		}
	};

	if (closed) {
		return null; // Don't render the tag if it's closed
	}

	return (
		<div
			ref={tagref}
			className={"tag " + className}
			style={{
				backgroundColor: colorToRGBA(color, 0.1),
				color: colorToRGBA(color, 0.7),
				borderColor: colorToRGBA(color, 0.3),
			}}
		>
			<span className="responsive-tag-text">{children}</span>
			{closable && (
				<button className="close-button" onClick={handleClose}>
					&times;
				</button>
			)}
		</div>
	);
};

export default Tag;

const colorToRGBA = (colorName: string, alpha: number = 1): string => {
	const canvas = document.createElement("canvas");
	canvas.width = 1;
	canvas.height = 1;
	const ctx = canvas.getContext("2d");
	if (!ctx) return "";

	ctx.fillStyle = colorName;
	ctx.fillRect(0, 0, 1, 1);

	const pixelData = ctx.getImageData(0, 0, 1, 1).data;
	return `rgba(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]}, ${alpha})`;
};
