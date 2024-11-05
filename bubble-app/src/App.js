import React, { useEffect, useState } from 'react';
import BubbleAnimation from './components/BubbleAnimation';
import './App.css';

const App = () => {
    const [currentSection, setCurrentSection] = useState(0);

    useEffect(() => {
        const sections = document.querySelectorAll('.full-viewport');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = Array.from(sections).indexOf(entry.target);
                    setCurrentSection(index);
                }
            });
        });

        sections.forEach((section) => {
            observer.observe(section);
        });

        return () => {
            sections.forEach((section) => {
                observer.unobserve(section);
            });
        };
    }, []);

    return (
        <div className="App">
            <BubbleAnimation currentSection={currentSection} />
            <div className="full-viewport bubble-section">
                <h1>Welcome to Section 1</h1>
                <p>This is the first section. It introduces the topic and sets the context.</p>
            </div>
            <div className="full-viewport section-2">
                <h1>Explore Section 2</h1>
                <p>In this section, we dive deeper into the subject matter, providing more detailed information.</p>
            </div>
            <div className="full-viewport section-3">
                <h1>Discover Section 3</h1>
                <p>This section includes examples and illustrations to enhance understanding of the topic.</p>
            </div>
            <div className="full-viewport section-4">
                <h1>Learn in Section 4</h1>
                <p>Here, we provide tips and best practices to apply the knowledge gained in the previous sections.</p>
            </div>
            <div className="full-viewport section-5">
                <h1>Conclusion in Section 5</h1>
                <p>This section wraps up the discussion, summarizing the key points and takeaways.</p>
            </div>
        </div>
    );
};

export default App;