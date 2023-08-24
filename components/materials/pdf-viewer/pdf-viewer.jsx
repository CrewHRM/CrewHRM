import React, { useState } from 'react';
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";

export function PDFViewer ({src}) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPrevPage = () =>
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);

  const goToNextPage = () =>
    setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1);

  return (
    <div className="page">
      <nav>
        <button onClick={goToPrevPage} className="previous">
          Prev
        </button>
        <button onClick={goToNextPage} className="next">
          Next
        </button>
        <p>
          Page {pageNumber} of {numPages}
        </p>
      </nav>

		<div className={'border-1 border-radius-5 border-color-tertiary'.classNames()}>
			<Document file={src} onLoadSuccess={onDocumentLoadSuccess}>
				<Page pageNumber={pageNumber} />
			</Document>
		</div>
      
    </div>
  );
};