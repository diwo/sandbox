-- Tower of Hanoi
module Tower ( mkState
             , mkStack
             , move
             , run
             , step
             , solve
             , solved
             , sample
             , sample_homo
             , test
             , testAll
             ) where

import Data.List
import Data.Maybe

newtype State = State { stacks :: [Stack] }
newtype Stack = Stack { disks :: [Disk] }
type Disk = Integer
type Move = (Col, Col)
type Col = Int
type Count = Int
type NaturalCol = Int

instance Show State where
  show (State stacks) = unlines $ map join $ zip labels contents
    where labels      = map label [1 .. length stacks]
          label n     = "stack " ++ (show n) ++ " | "
          contents    = map show stacks
          join (x, y) = x ++ y

instance Show Stack where
  show (Stack disks)
    | null disks = "Empty"
    | otherwise  = unwords $ map show $ reverse disks

mkState :: [Stack] -> State
mkState stacks
  | length stacks == 3 = State stacks
  | otherwise          = error "State must be made of 3 stacks"

mkStack :: [Disk] -> Stack
mkStack = foldl' (flip push) (Stack [])

push :: Disk -> Stack -> Stack
push d (Stack []) = Stack [d]
push d (Stack s@(x:_))
  | d <= x    = Stack (d:s)
  | otherwise = error "A larger disk cannot be placed on top of another disk"

pop :: Stack -> Stack
pop (Stack disks) = Stack $ tail disks

peek :: Stack -> Maybe Disk
peek (Stack [])    = Nothing
peek (Stack disks) = Just $ head disks

peekAll :: State -> [Maybe Disk]
peekAll = map peek . stacks

sizes :: State -> [Count]
sizes (State stacks) = map length $ map disks stacks

sizeUntil :: Disk -> Stack -> Count
sizeUntil disk stack
  | isNothing top       = 0
  | fromJust top > disk = 0
  | otherwise           = sizeUntil disk (pop stack) + 1
  where top = peek stack

move :: State -> NaturalCol -> NaturalCol -> State
move state src dest = move' state (src-1) (dest-1)

move' :: State -> Col -> Col -> State
move' (State stacks) nsrc ndest = mkState newStacks
  where newStacks = pushDest ndest $ popSrc nsrc stacks
        popSrc    = update pop
        pushDest  = update $ push disk
        disk      = fromJust $ peek $ stacks !! nsrc

update :: (a -> a) -> Int -> [a] -> [a]
update _ _ [] = []
update f 0 (x:xs) = f x : xs
update f n (x:xs) = x : update f (n-1) xs

solve :: State -> [Move]
solve state
  | solved state = []
  | allFirst     = fst $ moveMulti state sz1 0 1
  | otherwise    = moves ++ solve newState
  where allFirst          = sz2 == 0 && sz3 == 0
        [sz1, sz2, sz3]   = sizes state
        (moves, newState) = moveMulti state cnt src dest
        tops              = peekAll state
        (jsm:jmed:_)      = filter isJust $ sort tops
        src               = fromJust $ elemIndex jsm tops
        dest              = 2 - (fromJust $ elemIndex jmed $ reverse tops)
        cnt               = sizeUntil (fromJust jmed) $ stacks state !! src

moveMulti :: State -> Count -> Col -> Col -> ([Move], State)
moveMulti state 0 _ _ = ([], state)
moveMulti state cnt src dest
  | src == dest = ([], state)
  | otherwise   = (unstack ++ [(src, dest)] ++ restack, s3)
  where (unstack, s1) = moveMulti state (cnt-1) src other
        s2            = move' s1 src dest
        (restack, s3) = moveMulti s2 (cnt-1) other dest
        other         = fromJust $ find notSrcDest [0..2]
        notSrcDest x  = and $ map (x /=) [src, dest]

solved :: State -> Bool
solved state
  | s1 > 0           = False
  | s2 > 0 && s3 > 0 = False
  | otherwise        = True
  where [s1, s2, s3] = sizes state

run :: State -> [Move] -> State
run state [] = state
run state ((src, dest):moves) = run newState moves
  where newState = move' state src dest

step :: State -> IO ()
step state = step' state $ solve state

step' :: State -> [Move] -> IO ()
step' state moves = do
  print state
  if null moves
    then return ()
    else do readCr
            step' newState (tail moves)
  where newState    = move' state src dest
        (src, dest) = head moves
        readCr      = do putStrLn "Press return to continue..."
                         c <- getChar
                         if c == '\n'
                           then return ()
                           else readCr

sample = mkState [s1, s2, s3]
  where s1 = mkStack [6, 4, 1]
        s2 = mkStack [5, 2]
        s3 = mkStack [3]

sample_homo = mkState [s1, s2, s3]
  where s1 = mkStack [9, 9]
        s2 = mkStack [9, 9, 9]
        s3 = mkStack [9]

test :: State -> IO ()
test state = do
  print state
  if solved $ run state $ solve state
    then putStrLn "Solved\n"
    else putStrLn "Not solved\n"

testAll :: IO ()
testAll = mapM_ test [sample, sample_homo]

