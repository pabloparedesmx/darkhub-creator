
import { useState, useEffect } from 'react';
import { Course } from '@/components/ui/CourseCard';

export const useCourseFilters = (coursesData: Course[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [courses, setCourses] = useState<Course[]>(coursesData);
  const [filters, setFilters] = useState({
    all: true,
    tutorials: false
  });

  // Add selected tools filter
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  // Difficulty options
  const [difficulties, setDifficulties] = useState({
    beginner: false,
    intermediate: false,
    advanced: false
  });

  useEffect(() => {
    // Apply filters
    let filteredCourses = [...coursesData];

    // Apply search term filter
    if (searchTerm) {
      filteredCourses = filteredCourses.filter(course => 
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filters (tutorial)
    if (!filters.all) {
      if (filters.tutorials) {
        filteredCourses = filteredCourses.filter(course => 
          course.badges.includes('tutorial')
        );
      }
    }

    // Apply tools filters
    if (selectedTools.length > 0) {
      filteredCourses = filteredCourses.filter(course => 
        course.toolIds && selectedTools.some(toolId => course.toolIds?.includes(toolId))
      );
    }

    // Apply difficulty filters
    const selectedDifficulties = Object.entries(difficulties)
      .filter(([_, isSelected]) => isSelected)
      .map(([difficulty]) => difficulty);
    
    if (selectedDifficulties.length > 0) {
      filteredCourses = filteredCourses.filter(course => 
        course.difficulty && selectedDifficulties.includes(course.difficulty)
      );
    }

    // Apply sort order
    if (sortOrder === 'newest') {
      // For database-sourced courses, we can assume the ID reflects creation time or use created_at
      filteredCourses = [...filteredCourses].sort((a, b) => a.id > b.id ? -1 : 1);
    } else if (sortOrder === 'oldest') {
      filteredCourses = [...filteredCourses].sort((a, b) => a.id < b.id ? -1 : 1);
    } else if (sortOrder === 'az') {
      filteredCourses = [...filteredCourses].sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOrder === 'za') {
      filteredCourses = [...filteredCourses].sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortOrder === 'popular') {
      // In a real app, we'd sort by popularity metrics like enrollment count
      // For now, we'll just use a simple alphabetical sort as a fallback
      filteredCourses = [...filteredCourses].sort((a, b) => a.title.localeCompare(b.title));
    }

    setCourses(filteredCourses);
  }, [searchTerm, filters, difficulties, sortOrder, coursesData, selectedTools]);

  // Update courses when coursesData changes
  useEffect(() => {
    setCourses(coursesData);
  }, [coursesData]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setFilters({
      all: true,
      tutorials: false
    });
    setDifficulties({
      beginner: false,
      intermediate: false,
      advanced: false
    });
    setSelectedTools([]);
    setSortOrder('newest');
  };

  return {
    searchTerm,
    setSearchTerm,
    courses,
    filters,
    setFilters,
    difficulties,
    setDifficulties,
    selectedTools,
    setSelectedTools,
    clearAllFilters,
    setSortOrder
  };
};
