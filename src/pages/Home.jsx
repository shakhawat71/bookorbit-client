import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import HeroSlider from "../components/home/HeroSlider";
import LatestBooks from "../components/home/LatestBooks";
import Coverage from "../components/home/Coverage";
import Features from "../components/home/Features";
import ReaderReviews from "../components/home/ReaderReviews";
import FAQs from "../components/home/FAQs";
import Services from "../components/home/Services";

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const SLIDE_COUNT = 3;

  const sliderBooks = useMemo(() => {
    const candidates = books?.length ? shuffle(books) : [];
    return candidates.slice(0, SLIDE_COUNT);
  }, [books]);

  useEffect(() => {
    let mounted = true;

    const fetchBooksWithRetry = async (retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_URL}/books?status=published`
          );

          if (mounted) {
            setBooks(res.data || []);
            setLoading(false);
            return res.data || [];
          }
          return [];
        } catch {
          if (i === retries - 1) {
            if (mounted) {
              setBooks([]);
              setLoading(false);
            }
            return [];
          }
          await new Promise((resolve) => setTimeout(resolve, 700));
        }
      }
      return [];
    };

    const fetchReviews = async (booksToFetch) => {
      try {
        if (!booksToFetch || booksToFetch.length === 0) {
          setReviewsLoading(false);
          return;
        }

        // Fetch reviews for all books and combine them
        const allReviews = [];
        for (const book of booksToFetch) {
          try {
            const res = await axios.get(
              `${import.meta.env.VITE_API_URL}/reviews?bookId=${book._id}`
            );
            if (res.data && Array.isArray(res.data)) {
              allReviews.push(...res.data);
            }
          } catch {
            // Continue if a single book's reviews fail to load
            continue;
          }
        }

        if (mounted) {
          const shuffledReviews = shuffle(allReviews);
          setReviews(shuffledReviews);
        }
      } catch (error) {
        console.log("Failed to load reviews:", error);
        if (mounted) {
          setReviews([]);
        }
      } finally {
        if (mounted) {
          setReviewsLoading(false);
        }
      }
    };

    const run = async () => {
      const fetchedBooks = await fetchBooksWithRetry(3);
      await fetchReviews(fetchedBooks);
    };

    run();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="bg-base-100">
      <HeroSlider sliderBooks={sliderBooks} loading={loading} />
      <LatestBooks books={books} />
      <Coverage />
      <Features />
      <Services />
      <ReaderReviews reviews={reviews} reviewsLoading={reviewsLoading} />
      <FAQs />
    </div>
  );
}
