import { useEffect, useRef } from 'react';

interface InteractiveTNMapProps {
    selectedDistrict: string | null;
    onDistrictClick: (districtName: string) => void;
    districts: { name: string; tamil: string; registrations: number }[];
}

const InteractiveTNMap = ({ selectedDistrict, onDistrictClick, districts }: InteractiveTNMapProps) => {
    const svgRef = useRef<HTMLObjectElement>(null);

    useEffect(() => {
        const handleLoad = () => {
            const svgDoc = svgRef.current?.contentDocument;
            if (!svgDoc) return;

            // Calculate max registrations for color intensity
            const maxRegistrations = Math.max(...districts.map(d => d.registrations));

            // Find all text elements in the SVG (district labels)
            const textElements = svgDoc.querySelectorAll('text');
            
            textElements.forEach((textEl) => {
                const districtName = textEl.textContent?.trim();
                if (!districtName) return;

                // Find matching district in data
                const district = districts.find(d => 
                    d.name.toLowerCase() === districtName.toLowerCase() ||
                    d.tamil === districtName
                );

                if (district) {
                    // Replace English name with Tamil name
                    textEl.textContent = district.tamil;
                    
                    // Make the text clickable
                    textEl.style.cursor = 'pointer';
                    textEl.style.userSelect = 'none';
                    textEl.style.fontFamily = 'Baloo 2, sans-serif';
                    
                    // Add click handler
                    textEl.addEventListener('click', () => {
                        onDistrictClick(district.name);
                    });

                    // Highlight selected district
                    if (selectedDistrict === district.name) {
                        textEl.style.fill = '#dc2626';
                        textEl.style.fontWeight = 'bold';
                        textEl.style.fontSize = '28px';
                    } else {
                        textEl.style.fill = '#000000ff';
                        textEl.style.fontWeight = 'bold';
                        textEl.style.fontSize = '28px';

                    }

                    // Hover effect
                    textEl.addEventListener('mouseenter', () => {
                        if (selectedDistrict !== district.name) {
                            textEl.style.fill = '#ef4444';
                        }
                    });

                    textEl.addEventListener('mouseleave', () => {
                        if (selectedDistrict !== district.name) {
                            textEl.style.fill = '#000000ff';
                        }
                    });

                    // Find and color the corresponding path/polygon near this text
                    const textBBox = textEl.getBBox();
                    const textX = textBBox.x + textBBox.width / 2;
                    const textY = textBBox.y + textBBox.height / 2;

                    const paths = svgDoc.querySelectorAll('path, polygon');
                    paths.forEach((path) => {
                        const pathBBox = (path as SVGGraphicsElement).getBBox();
                        const pathCenterX = pathBBox.x + pathBBox.width / 2;
                        const pathCenterY = pathBBox.y + pathBBox.height / 2;
                        
                        // Check if text is near this path (increased threshold for better coverage)
                        const distance = Math.sqrt(
                            Math.pow(textX - pathCenterX, 2) + 
                            Math.pow(textY - pathCenterY, 2)
                        );

                        if (distance < 200) {
                            // Apply background color based on registrations
                            const intensity = district.registrations / maxRegistrations;
                            let fillColor = '#fde68a'; // yellow-200 (low)
                            
                            if (selectedDistrict === district.name) {
                                fillColor = '#dc2626'; // red-600 (selected)
                            } else if (intensity > 0.7) {
                                fillColor = '#fbbf24'; // yellow-400 (high)
                            } else if (intensity > 0.4) {
                                fillColor = '#fcd34d'; // yellow-300 (medium)
                            }

                            (path as SVGElement).style.fill = fillColor;
                            (path as SVGElement).style.fillOpacity = '0.7';
                            (path as SVGElement).style.stroke = '#374151';
                            (path as SVGElement).style.strokeWidth = '1';
                            (path as SVGElement).style.cursor = 'pointer';
                            (path as SVGElement).style.transition = 'all 0.3s';

                            // Add click handler to path
                            path.addEventListener('click', () => {
                                onDistrictClick(district.name);
                            });

                            // Add hover effect
                            path.addEventListener('mouseenter', () => {
                                if (selectedDistrict !== district.name) {
                                    (path as SVGElement).style.fillOpacity = '0.9';
                                    (path as SVGElement).style.stroke = '#ef4444';
                                    (path as SVGElement).style.strokeWidth = '2';
                                }
                            });

                            path.addEventListener('mouseleave', () => {
                                if (selectedDistrict !== district.name) {
                                    (path as SVGElement).style.fillOpacity = '0.7';
                                    (path as SVGElement).style.stroke = '#374151';
                                    (path as SVGElement).style.strokeWidth = '1';
                                }
                            });
                        }
                    });
                }
            });

            // Style remaining paths that weren't matched
            const paths = svgDoc.querySelectorAll('path, polygon');
            paths.forEach((path) => {
                if (!(path as SVGElement).style.fill) {
                    (path as SVGElement).style.fill = '#e5e7eb'; // gray-200 (no data)
                    (path as SVGElement).style.fillOpacity = '0.5';
                    (path as SVGElement).style.stroke = '#374151';
                    (path as SVGElement).style.strokeWidth = '1';
                }
            });
        };

        const objectEl = svgRef.current;
        if (objectEl) {
            objectEl.addEventListener('load', handleLoad);
            return () => objectEl.removeEventListener('load', handleLoad);
        }
    }, [selectedDistrict, districts, onDistrictClick]);

    return (
        <object
            ref={svgRef}
            data="/tamil-nadu-map.svg"
            type="image/svg+xml"
            className="w-full h-auto [transform:scale(1,1)] md:[transform:scale(0.9,0.65)] [transform-origin:top_center]"
            aria-label="Tamil Nadu Districts Map"
        />
    );
};

export default InteractiveTNMap;
