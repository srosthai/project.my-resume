import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface CoverLightboxProps {
	src: string;
	alt: string;
}

export default function CoverLightbox({ src, alt }: CoverLightboxProps) {
	const [open, setOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const closeRef = useRef<HTMLButtonElement>(null);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const titleId = useId();

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!open) return;

		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') setOpen(false);
		};

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		window.addEventListener('keydown', onKey);
		closeRef.current?.focus();

		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener('keydown', onKey);
			triggerRef.current?.focus();
		};
	}, [open]);

	return (
		<>
			<figure className="detail__cover-wrap">
				<button
					ref={triggerRef}
					type="button"
					className="detail__cover-trigger"
					onClick={() => setOpen(true)}
					aria-haspopup="dialog"
					aria-expanded={open}
					aria-label={`View full image: ${alt}`}
				>
					<img
						className="detail__cover"
						src={src}
						alt={alt}
						width={1200}
						height={900}
						loading="eager"
						decoding="async"
					/>
					<span className="detail__cover-hint" aria-hidden="true">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none">
							<path
								d="M9 4.5H4.5V9M15 4.5h4.5V9M9 19.5H4.5V15M15 19.5h4.5V15"
								stroke="currentColor"
								strokeWidth="1.75"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
						<span>View</span>
					</span>
				</button>
			</figure>

			{mounted &&
				open &&
				createPortal(
					<div
						className="lightbox"
						role="dialog"
						aria-modal="true"
						aria-labelledby={titleId}
						onClick={() => setOpen(false)}
					>
						<div className="lightbox__chrome">
							<p id={titleId} className="lightbox__title">
								{alt}
							</p>
							<button
								ref={closeRef}
								type="button"
								className="lightbox__close"
								aria-label="Close image viewer"
								onClick={() => setOpen(false)}
							>
								<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
									<path
										d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5"
										stroke="currentColor"
										strokeWidth="1.75"
										strokeLinecap="round"
									/>
								</svg>
							</button>
						</div>
						<img
							className="lightbox__image"
							src={src}
							alt={alt}
							onClick={(event) => event.stopPropagation()}
						/>
					</div>,
					document.body,
				)}
		</>
	);
}
