FROM archlinux as builder

RUN pacman -Sy --noconfirm git make cmake clang boost

RUN git clone --depth 1 --recursive -b release https://github.com/ethereum/solidity
WORKDIR /solidity
RUN git checkout tags/v0.6.10                                             
RUN cmake -DCMAKE_BUILD_TYPE=Release -DTESTS=0 -DSTATIC_LINKING=1
RUN make solc
RUN install -s solc/solc /usr/bin                                          


FROM archlinux as runtime

RUN pacman -Sy --noconfirm git libnghttp2 nodejs npm python
RUN npm install -g truffle 
RUN npm install -g @truffle/hdwallet-provider

COPY --from=builder /usr/bin/solc /usr/bin/     

EXPOSE 8545 9545