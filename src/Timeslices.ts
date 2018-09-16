export interface TimeSlice {
	start: number;
	end: number;
}
export type TimeSlices = TimeSlice[];

export function timeslice_init(): TimeSlices {
	return [];
}

export function timeslice_add(slices: TimeSlices, start: number, end: number): TimeSlices {
	const newSlices: TimeSlices = [];

	let foundSlice = false;
	for (const slice of slices) {
		// Within slice
		if (slice.start <= start && slice.end >= end) {
			return slices;
		}
		// Append to current slice
		else if (slice.start <= start && slice.end >= start) {
			newSlices.push({ ...slice, end });
			foundSlice = true;
		}
		// Prepend to current slice
		else if (slice.start <= end && slice.end >= end) {
			newSlices.push({ ...slice, start });
			foundSlice = true;
		}
		else {
			newSlices.push(slice);
		}
	}
	
	if (!foundSlice) {
		newSlices.push({ start, end });
	}

	const sortedSlices = newSlices.sort((a, b) => a.start - b.start);

	const mergedSlices = sortedSlices.reduce((mergedSlices, currentSlice) => {
		if (mergedSlices.length === 0) {
			mergedSlices.push(currentSlice);
		} else {
			const prevSlice = mergedSlices[mergedSlices.length - 1];
			if (prevSlice.end >= currentSlice.start && prevSlice.end <= currentSlice.end) {
				prevSlice.end = currentSlice.end;
			} else {
				mergedSlices.push(currentSlice);
			}
		}
		return mergedSlices;
	}, [] as TimeSlices);

	return mergedSlices;
}

export function timeslice_percentage(slices: TimeSlices, length: number): number {
	return slices.reduce((sum, slice) => sum + (slice.end - slice.start), 0) / length;
}