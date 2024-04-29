import React, { ReactElement, useEffect, useRef, useState } from "react";
import Tag from "../Tag";
import Tooltip from "rc-tooltip";
import Dropdown from "rc-dropdown";
import "./style.css";
import Menu, { MenuItem } from "rc-menu";
import "rc-dropdown/assets/index.css";
import "rc-tooltip/assets/bootstrap_white.css";
import "rc-menu/assets/index.css";

export interface NavbarItem {
	name: string | React.ReactNode;
	id?: string | number | undefined;
	type?: "div" | "tag";
}

export interface ResponsiveTagsProps {
	showNavItemTooltip?: boolean;
	initialUpdateDelay?: number;
	list: NavbarItem[];
	onTagClose?: (id: string | number | undefined, item: NavbarItem) => void;
}

const ResponsiveTags: React.FC<ResponsiveTagsProps> = ({
	showNavItemTooltip = true,
	initialUpdateDelay = 100,
	list,
	onTagClose,
}) => {
	const [updateDimensions, setUpdateDimensions] = useState(false);
	const [lastVisibleItemIndex, setLastVisibleItemIndex] = useState(-1);
	const [lastWidth, setLastWidth] = useState(0);

	const navbarContainerRef = useRef<HTMLDivElement>(null);
	const navitemRefs: HTMLDivElement[] = [];
	console.log(navitemRefs);
	const handleResizeEvent = () => {
		const difference = window.innerWidth - lastWidth;
		const UPDATE_THRESHOLD = 100;
		if (Math.abs(difference) > UPDATE_THRESHOLD) {
			setUpdateDimensions((prev) => !prev);
			setLastWidth(window.innerWidth);
		}
	};
	useEffect(() => {
		window.addEventListener("resize", handleResizeEvent);
		window.addEventListener("orientationchange", handleResizeEvent); // for mobile support

		setTimeout(() => {
			handleResizeEvent();
		}, initialUpdateDelay);

		return () => {
			window.removeEventListener("resize", handleResizeEvent);
			window.removeEventListener("orientationchange", handleResizeEvent);
		};
	}, [initialUpdateDelay, lastWidth]);

	useEffect(() => {
		if (updateDimensions) {
			setUpdateDimensions((prev) => !prev);
			setLastVisibleItemIndex(indexOfLastVisibleNavItem());
		}
	}, [updateDimensions]);

	const indexOfLastVisibleNavItem = () => {
		const containerWidth = navbarContainerRef.current
			? navbarContainerRef.current.offsetWidth
			: 0;
		let remainingWidth = containerWidth - 195;
		let lastVisible = 1;

		for (let i = 0; i < list.length - 1; i += 1) {
			const node = navitemRefs[i];
			console.log(navitemRefs, "navitemRefs");
			console.log(node, "node");
			console.log(navitemRefs[i], "navitemRefs[i]");
			if (!node) {
				break;
			}

			const itemWidth = (node as HTMLElement).offsetWidth;
			remainingWidth -= itemWidth;

			if (remainingWidth < 0) {
				lastVisible -= 1;
				break;
			}

			lastVisible += 1;
		}
		return lastVisible;
	};

	const navbarItem = (item: NavbarItem, index: number) => {
		if (item?.type === "div") {
			return (
				<div
					key={item.id || `navitemref${index}`}
					ref={(el) => {
						if (el) {
							navitemRefs[index] = el;
						}
					}}
					style={{
						display: "flex",
						height: "max-content",
						whiteSpace: "nowrap",
					}}
				>
					{item.name}
				</div>
			);
		}
		return (
			<Tag
				key={item.id || `navitemref${index}`}
				tagref={(el) => {
					// console.log(el, "el");
					// console.log(index, "index");
					if (el) {
						navitemRefs[index] = el;
					}

					// console.log(navitemRefs, "navitemRefs");
				}}
				color="blue"
				closable
				onClose={() => {
					onTagClose && onTagClose(item.id, item);
					setUpdateDimensions((prev) => !prev);
				}}
			>
				<span className="responsive-tag-text">{item.name}</span>
			</Tag>
		);
	};

	const tooltipWrapper = (
		node: ReactElement,
		index: number,
		tooltipContent: string,
	) => {
		return showNavItemTooltip ? (
			<Tooltip key={index} placement="bottom" overlay={tooltipContent}>
				{node}
			</Tooltip>
		) : (
			node
		);
	};

	const navbar = () => {
		const listToShow =
			lastVisibleItemIndex >= 0 ? list.slice(0, lastVisibleItemIndex) : list;

		const items = listToShow.map((item, index) =>
			tooltipWrapper(
				navbarItem(item, index),
				index,
				typeof item.name === "string" ? item.name : "",
			),
		);

		return (
			<div className="responsive-tag-wrapper">
				<div className="responsive-tag-container" ref={navbarContainerRef}>
					{items}
					{combobox()}
				</div>
			</div>
		);
	};

	const combobox = () => {
		if (lastVisibleItemIndex === -1 || lastVisibleItemIndex > list.length - 1) {
			return null;
		}
		const listToShow =
			lastVisibleItemIndex >= 0
				? list.slice(lastVisibleItemIndex, list.length)
				: list;

		const menu = (
			<Menu>
				{listToShow.map((item, index) => (
					<MenuItem key={index}>{item.name}</MenuItem>
				))}
			</Menu>
		);
		return (
			<Dropdown
				// overlayClassName="responsive-tag-menu-container"
				overlay={menu}
				trigger={["click"]}
			>
				<div>
					<Tag className="cursor-pointer" color="blue">
						+{listToShow.length}
					</Tag>
				</div>
			</Dropdown>
		);
	};

	return navbar();
};

export default ResponsiveTags;
