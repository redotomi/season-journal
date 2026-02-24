import { useRef, useState } from "react";
import { View } from "react-native";
import WebView from "react-native-webview";

type Props = {
	base64Uri: string;
	width: number;
	height: number;
	onColorPicked: (hex: string) => void;
	onCancel: () => void;
};

export default function EyedropperLayer({
	base64Uri,
	width,
	height,
	onColorPicked,
	onCancel,
}: Props) {
	const webviewRef = useRef<WebView>(null);
	const [isReady, setIsReady] = useState(false);

	const html = `
<!DOCTYPE html>
<html>
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
	<style>
		body { 
			margin: 0; padding: 0; overflow: hidden; 
			background-color: transparent; 
			touch-action: none;
            -webkit-user-select: none;
            user-select: none;
		}
		canvas { display: block; }
		#loupe {
			position: absolute;
			width: 80px;
			height: 80px;
			border-radius: 50%;
			border: 4px solid white;
			box-shadow: 0 4px 12px rgba(0,0,0,0.3);
			pointer-events: none;
			display: none;
			background-color: white;
			background-repeat: no-repeat;
			image-rendering: pixelated;
			z-index: 1000;
		}
	</style>
</head>
<body>
	<canvas id="c"></canvas>
	<div id="loupe"></div>
	<script>
		const canvas = document.getElementById('c');
		const ctx = canvas.getContext('2d', { willReadFrequently: true });
		let isPicking = false;
		let imgWidth = ${width};
		let imgHeight = ${height};
		
		canvas.width = imgWidth;
		canvas.height = imgHeight;

        function safePostMessage(msg) {
            if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
                window.ReactNativeWebView.postMessage(JSON.stringify(msg));
            } else {
                setTimeout(() => safePostMessage(msg), 50);
            }
        }

		const img = new Image();
		img.onload = () => {
			ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
            safePostMessage({ type: 'READY' });
		};
        img.onerror = () => {
            safePostMessage({ type: 'READY' });
        }
		img.src = "${base64Uri}";

		const loupe = document.getElementById('loupe');

		function rgbToHex(r, g, b) {
			return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
		}

		function handleTouch(x, y, isEnd) {
			if (x < 0 || y < 0 || x >= imgWidth || y >= imgHeight) return;
			
            try {
                const pixel = ctx.getImageData(x, y, 1, 1).data;
                const hex = rgbToHex(pixel[0], pixel[1], pixel[2]);

                if (isEnd) {
                    loupe.style.display = 'none';
                    safePostMessage({ type: 'PICKED', hex });
                } else {
                    loupe.style.display = 'block';
                    const offsetX = x - 40;
                    const offsetY = y - 100;
                    loupe.style.transform = \`translate(\${offsetX}px, \${offsetY}px)\`;
                    loupe.style.backgroundColor = hex;
                }
            } catch (e) {
            }
		}

		document.addEventListener('touchstart', (e) => {
			isPicking = true;
			const touch = e.touches[0];
			handleTouch(touch.clientX, touch.clientY, false);
		}, { passive: false });

		document.addEventListener('touchmove', (e) => {
			e.preventDefault();
			if (!isPicking) return;
			const touch = e.touches[0];
			handleTouch(touch.clientX, touch.clientY, false);
		}, { passive: false });

		document.addEventListener('touchend', (e) => {
			if (!isPicking) return;
			isPicking = false;
			const touch = e.changedTouches[0];
			handleTouch(touch.clientX, touch.clientY, true);
		});

		document.addEventListener('touchcancel', () => {
			isPicking = false;
			loupe.style.display = 'none';
		});
	</script>
</body>
</html>
	`;

	const handleMessage = (event: any) => {
		try {
			const data = JSON.parse(event.nativeEvent.data);
			if (data.type === "READY") {
				setIsReady(true);
			} else if (data.type === "PICKED") {
				setIsReady(false);
				onColorPicked(data.hex);
			}
		} catch (e) {
		}
	};

	return (
		<View
			style={{
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: 9999,
				backgroundColor: "transparent",
			}}
		>
			<WebView
				ref={webviewRef}
				source={{ html }}
				originWhitelist={['*']}
				scrollEnabled={false}
				bounces={false}
				onMessage={handleMessage}
				style={{
					width,
					height,
					backgroundColor: "transparent",
					opacity: isReady ? 1 : 0.01,
				}}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				javaScriptEnabled={true}
			/>
		</View>
	);
}
