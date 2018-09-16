import 'mocha';
import { use, expect, should } from 'chai';
should();
import { timeslice_init, timeslice_add, timeslice_percentage } from '../src/Timeslices';

describe('Timeslices', () => {

	it('init with empty slices', () => {
		const slices = timeslice_init();
		expect(slices).to.eql([]);
	});

	it('add new slice', () => {
		// New slice
		const a = timeslice_add([], 0, 2);
		expect(a).to.eql([{ start: 0, end: 2 }]);

		// Extend slice (append)
		const b = timeslice_add(a, 2, 3);
		expect(b).to.eql([{ start: 0, end: 3 }]);

		// New slice
		const c = timeslice_add(b, 8, 10);
		expect(c).to.eql([{ start: 0, end: 3 }, { start: 8, end: 10 }]);

		// Extend slice (prepend)
		const d = timeslice_add(c, 6, 9);
		expect(d).to.eql([{ start: 0, end: 3 }, { start: 6, end: 10 }]);

		// New slice
		const e = timeslice_add(d, 4, 5);
		expect(e).to.eql([{ start: 0, end: 3 }, { start: 4, end: 5 }, { start: 6, end: 10 }]);

		// Merge slices...
		const f = timeslice_add(e, 3, 4);
		expect(f).to.eql([{ start: 0, end: 5 }, { start: 6, end: 10 }]);

		// Merge slices...
		const g = timeslice_add(f, 3, 8);
		expect(g).to.eql([{ start: 0, end: 10 }]);
	});

	it('maintain immutability', () => {
		const a = timeslice_add([], 0, 2);
		const b = timeslice_add(a, 2, 3);
		expect(b).to.not.equal(a);

		const c = timeslice_add(b, 2, 3);
		expect(c).to.equal(b);

		const d = timeslice_add(c, 8, 10);
		expect(d).to.not.equal(c);
	});

	it('calculate percentage', () => {
		expect(timeslice_percentage([{start: 0, end: 3}, {start: 6, end: 8}], 10)).to.equal(0.5);
		expect(timeslice_percentage([{start: 0, end: 2}, {start: 4, end: 5}, {start: 6, end: 9}], 10)).to.equal(0.6);
		expect(timeslice_percentage([{start: 0, end: 5}, {start: 6, end: 9}], 10)).to.equal(0.8);
		expect(timeslice_percentage([{start: 0, end: 10}], 10)).to.equal(1.0);
	});

});