/* eslint-disable no-unused-vars */
import { useState, useEffect, useCallback } from 'react';

export const useLeaveProvisionData = (initialFilters) => {
    const [filters, setFilters] = useState(initialFilters);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({});

    const calculateStats = useCallback((ledgerData) => {
        if (!ledgerData || ledgerData.length === 0) return {};

        const totalDebit = ledgerData
            .filter(item => item.debit && item.debit !== '-')
            .reduce((sum, item) => sum + parseFloat(item.debit.replace(/,/g, '')), 0);

        const totalCredit = ledgerData
            .filter(item => item.credit && item.credit !== '-')
            .reduce((sum, item) => sum + parseFloat(item.credit.replace(/,/g, '')), 0);

        const employeeCounts = ledgerData
            .filter(item => item.employeeCount && item.employeeCount !== '-')
            .map(item => parseInt(item.employeeCount));

        const avgEmployees = employeeCounts.length > 0
            ? Math.round(employeeCounts.reduce((a, b) => a + b, 0) / employeeCounts.length)
            : 0;

        return {
            totalDebit,
            totalCredit,
            netProvision: totalDebit - totalCredit,
            avgEmployees,
            transactionCount: ledgerData.length
        };
    }, []);

    const filterData = useCallback((allData, filters) => {
        return allData.filter(item => {
            // Date filtering
            if (filters.fromDate && filters.toDate) {
                const itemDate = new Date(item.date);
                const fromDate = new Date(filters.fromDate);
                const toDate = new Date(filters.toDate);
                if (itemDate < fromDate || itemDate > toDate) return false;
            }

            // Department filtering
            if (filters.department !== 'all' && item.costCenter) {
                if (!item.costCenter.includes(filters.department)) return false;
            }

            // Period type filtering
            if (filters.ledgerView === 'quarterly' && !item.isHeader) {
                // Implement quarterly grouping logic
                const month = new Date(item.date).getMonth();
                const quarter = Math.floor(month / 3) + 1;
                // Filter logic for quarters
            }

            return true;
        });
    }, []);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            // In production, this would be an API call
            // For now, using imported data
            const response = await import('../data/leaveProvisionData');
            const filteredData = filterData(response.ledgerData, filters);
            const calculatedStats = calculateStats(filteredData);

            setData(filteredData);
            setStats(calculatedStats);
            setError(null);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching leave provision data:', err);
        } finally {
            setLoading(false);
        }
    }, [filters, filterData, calculateStats]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        stats,
        loading,
        error,
        filters,
        setFilters,
        refetch: fetchData
    };
};