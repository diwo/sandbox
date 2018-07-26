module Tree where

import Data.Maybe

data Tree a = Tree { val :: a
                   , left :: Maybe (Tree a)
                   , right :: Maybe (Tree a)
                   } deriving Show

mkTree :: [a] -> Maybe (Tree a)
mkTree [] = Nothing
mkTree (x:xs) = Just Tree { val = x
                          , left = mkTree p1
                          , right = mkTree p2 }
  where (p1, p2) = partition 1 xs

partition :: Int -> [a] -> ([a], [a])
partition n [] = ([], [])
partition n xs = (p1, p2)
  where p1 = front ++ back1
        p2 = mid ++ back2
        (front, rest)  = splitAt n xs
        (mid, back)    = splitAt n rest
        (back1, back2) = partition (n*2) back

bft :: Maybe (Tree a) -> [a]
bft t = bft' [t]

bft' :: [Maybe (Tree a)] -> [a]
bft' [] = []
bft' (x:xs)
  | isNothing x = bft' xs
  | otherwise   = val : bft' (xs ++ [left, right])
  where (Tree val left right) = fromJust x

dft :: Maybe (Tree a) -> [a]
dft Nothing = []
dft (Just (Tree val left right)) = dft left ++ [val] ++ dft right

test :: IO ()
test = assert [ (bft $ mkTree [1..10]) == [1..10]
              , (dft $ mkTree [1..10]) == [8,4,9,2,10,5,1,6,3,7] ]
  where assert ps = mapM_ assertCase $ zip [1..length ps] ps
        assertCase (n, p) = putStrLn $ "Test " ++ show n ++ ": " ++ passFail p
        passFail p = if p then "Pass" else "Fail"

