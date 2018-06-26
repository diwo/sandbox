mymap :: (a -> b) -> [a] -> [b]
mymap _ [] = []
mymap f (x:xs) = f x : mymap f xs

mytake :: Integer -> [a] -> [a]
mytake 0 _ = []
mytake n (x:xs) = x : mytake (n-1) xs

myfilter :: (a -> Bool) -> [a] -> [a]
myfilter _ [] = []
myfilter p (x:xs)
  | p x       = x : myfilter p xs
  | otherwise = myfilter p xs

myreverse :: [a] -> [a]
myreverse = myreverse' []
  where myreverse' soln []     = soln
        myreverse' soln (x:xs) = myreverse' (x:soln) xs

myfind :: (a -> Bool) -> [a] -> Maybe a
myfind _ [] = Nothing
myfind p (x:xs)
  | p x       = Just x
  | otherwise = myfind p xs

mymax :: Ord a => [a] -> a
mymax (x:xs) = mymax' x xs
  where mymax' m [] = m
        mymax' m (x:xs)
          | x > m     = mymax' x xs
          | otherwise = mymax' m xs

palindrome :: Eq a => [a] -> Bool
palindrome xs = equal xs $ reverse xs
  where equal [] [] = True
        equal (x:xs) (y:ys)
          | x == y    = equal xs ys
          | otherwise = False

zip2lists :: [a] -> [a] -> [a]
zip2lists xs [] = xs
zip2lists [] ys = ys
zip2lists (x:xs) (y:ys) = x : y : zip2lists xs ys

ziplists :: [[a]] -> [a]
ziplists [] = []
ziplists ([]:ls) = ziplists ls
ziplists ((x:xs):ls) = x : ziplists (ls ++ [xs])

