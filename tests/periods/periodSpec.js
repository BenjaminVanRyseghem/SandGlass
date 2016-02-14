const periodClass = require("../../src/periods/period");

describe("periods/period", () => {
    "use strict";

    let period;
    beforeEach(() => {
        period = periodClass();
    });

    it("has no year", () => {
        expect(period.getYear()).toBe(null);
    });

    it("delegate the fetch of months to the year", () => {
        let fakeGetMonths = jasmine.createSpy("getMonths");
        spyOn(period, "getYear").and.returnValue({getMonths: fakeGetMonths});

        period.getMonths();

        expect(period.getYear).toHaveBeenCalled();
        expect(fakeGetMonths).toHaveBeenCalled();
    });

    it("delegate to the year to resolve `containsYear`", () => {
        let fakeContainsYear = jasmine.createSpy("containsYear");
        spyOn(period, "getYear").and.returnValue({containsYear: fakeContainsYear});

        period.containsYear("2016");

        expect(period.getYear).toHaveBeenCalled();
        expect(fakeContainsYear).toHaveBeenCalledWith("2016");
    });

    it("accept a visitor by calling `visitPeriod`", () => {
        let visitPeriod = jasmine.createSpy("visitPeriod");
        let visitor = {visitPeriod: visitPeriod};

        period.accept(visitor);

        expect(visitPeriod).toHaveBeenCalledWith(period);
    });

});
